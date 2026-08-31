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

// Le studio vend une proposition ecrite : il lui faut au moins un moyen de
// la faire parvenir. Ni `phone` ni `email` n est requis seul — chacun n est
// verifie dans son format que s il est rempli, une chaine vide passant les
// deux refine — c est le .refine() final qui impose l un des deux (constat
// 6, revue de marque). La validation client (ContactForm.tsx) mime cette
// meme regle, mais ne remplace jamais celle-ci.
const SchemaContact = z
  .object({
    name: z.string().min(2).max(80),
    phone: z
      .string()
      .max(20)
      .refine((v) => v === "" || /^[+0-9 ().-]{7,20}$/.test(v), "Numéro de téléphone invalide."),
    email: z
      .string()
      .max(160)
      .refine((v) => v === "" || z.email().safeParse(v).success, "Adresse e-mail invalide."),
    message: z.string().max(1000),
    website: z.string().optional(),
  })
  .refine((data) => data.phone.trim() !== "" || data.email.trim() !== "", {
    message: "Indiquez un téléphone ou un e-mail.",
    path: ["phone"],
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
  const { name, phone, email, message } = analyse.data;

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

  // 4. Le lead. `email` est optionnel en base (Lead.email String?) : une
  //    chaine vide devient null plutot que d y ecrire "" — le refine du
  //    schema garantit deja qu au moins phone ou email est renseigne.
  await prisma.lead.create({
    data: {
      name,
      phone,
      email: email.trim() === "" ? null : email,
      source: "FORM",
      status: "NEW",
      needSummary: message,
    },
  });

  // 5. Notification. notifyTelegram ne jette deja pas ; ce try/catch est la
  //    ceinture par-dessus les bretelles : sous aucun pretexte cette ligne ne
  //    doit transformer un lead enregistre en erreur 500.
  const extrait =
    message.length > EXTRAIT_MAX ? `${message.slice(0, EXTRAIT_MAX)}…` : message;
  // notifyTelegram (lib/telegram.ts) ne prend qu un texte libre : l e-mail
  // s ajoute donc ici a la ligne de contact, sans toucher ce fichier.
  const contact = [phone.trim(), email.trim()].filter(Boolean).join(" · ");
  try {
    await notifyTelegram(`🆕 Lead FORM — ${name}, ${contact} : ${extrait}`);
  } catch {
    console.warn("[contact] notification Telegram en échec — lead enregistré malgré tout");
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
