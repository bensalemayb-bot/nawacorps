import { NextResponse } from "next/server";
import { z } from "zod";
import { creerSession, motDePasseValide } from "@/lib/admin-auth";
import { clientIp, hashIp } from "@/lib/iphash";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/login — ouvre une session d administration.
 *
 * L ORDRE COMPTE, comme au bloc B8 : le debit passe AVANT la verification du
 * mot de passe. L inverse laisserait un attaquant essayer sans limite tant
 * qu il se trompe, ce qui est exactement le scenario a empecher.
 *
 * Le jeton est consomme meme quand le mot de passe est BON. C est voulu : ne
 * decompter que les echecs revelerait, par le simple fait de ne pas etre
 * compte, qu un mot de passe etait juste.
 *
 * REPONSE UNIFORME EN CAS D ECHEC : 401 sans detail. Ni « mot de passe faux »,
 * ni « administration non configuree » — un message different selon la cause
 * renseignerait sur l etat du deploiement.
 */

const FENETRE_MS = 60 * 60 * 1000;
const MAX_PAR_FENETRE = 5;
const ACTION = "login";

const SchemaLogin = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const analyse = SchemaLogin.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // 1. Debit, avant toute verification.
  const ipHash = hashIp(clientIp(req.headers));
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: new Date(Date.now() - FENETRE_MS) } },
  });
  if (recentes >= MAX_PAR_FENETRE) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 2. Mot de passe.
  if (!motDePasseValide(analyse.data.password)) {
    return NextResponse.json({ error: "Identifiants refusés." }, { status: 401 });
  }

  // 3. Session.
  const session = creerSession();
  const reponse = NextResponse.json({ ok: true }, { status: 200 });
  reponse.cookies.set(session.nom, session.valeur, session.options);
  return reponse;
}
