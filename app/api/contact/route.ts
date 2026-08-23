import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, hashIp } from "@/lib/iphash";
import { prisma } from "@/lib/prisma";
import { notifyTelegram } from "@/lib/telegram";

/**
 * POST /api/contact — enregistre un Lead et notifie Telegram.
 *
 * L ORDRE DES ETAPES EST LA SECURITE. Il ne doit pas etre reamenage :
 *  1. leurre  — un bot rempli repart avec un 200 identique a un succes. Aucune
 *     ecriture, aucun signal qui lui permettrait d apprendre qu il est detecte.
 *  2. schema  — la validation precede la base : rien de non valide ne l atteint.
 *  3. debit   — le compteur precede l ecriture du lead, sinon un attaquant
 *     ecrirait autant de leads qu il veut avant d etre refuse.
 *  4. lead    — l ecriture qui compte.
 *  5. Telegram — APRES, et sous try/catch. Le lead est deja sauve : une panne
 *     de notification ne peut plus rien lui coûter.
 *
 * Le message du visiteur est range dans Lead.needSummary. Le modele de B2 n a
 * pas de champ `message` et B8 interdit d en ajouter un ; `needSummary` est le
 * champ qui porte le besoin exprime, `notes` se lisant comme une annotation
 * interne. Decision signalee.
 */

const FENETRE_MS = 60 * 60 * 1000; // 1 h
const MAX_PAR_FENETRE = 5;
const ACTION = "contact";
const EXTRAIT_MAX = 200;

const SchemaContact = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^[+0-9 ().-]{7,20}$/),
  message: z.string().max(1000),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corps de requête illisible." }, { status: 400 });
  }

  // 1. Leurre. Un humain ne voit pas ce champ ; un bot le remplit.
  //    Reponse volontairement indiscernable d un succes.
  const website = (brut as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 2. Schema.
  const analyse = SchemaContact.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Données invalides.",
        issues: analyse.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const { name, phone, message } = analyse.data;

  // 3. Limitation de debit, sur IP hachee.
  const ipHash = hashIp(clientIp(req.headers));
  const depuis = new Date(Date.now() - FENETRE_MS);
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: depuis } },
  });
  if (recentes >= MAX_PAR_FENETRE) {
    return NextResponse.json(
      { error: "Trop de demandes, réessayez plus tard." },
      { status: 429 },
    );
  }
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 4. Le lead.
  await prisma.lead.create({
    data: { name, phone, source: "FORM", status: "NEW", needSummary: message },
  });

  // 5. Notification. notifyTelegram ne jette deja pas ; ce try/catch est la
  //    ceinture par-dessus les bretelles : sous aucun pretexte cette ligne ne
  //    doit transformer un lead enregistre en erreur 500.
  const extrait =
    message.length > EXTRAIT_MAX ? `${message.slice(0, EXTRAIT_MAX)}…` : message;
  try {
    await notifyTelegram(`🆕 Lead FORM — ${name}, ${phone} : ${extrait}`);
  } catch {
    console.warn("[contact] notification Telegram en échec — lead enregistré malgré tout");
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
