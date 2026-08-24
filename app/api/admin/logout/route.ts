import { NextResponse } from "next/server";
import { effacerSession } from "@/lib/admin-auth";

/**
 * POST /api/admin/logout — ferme la session.
 *
 * Aucune garde requireAdmin : se deconnecter sans session valide n a aucun
 * effet de bord, et exiger d etre connecte pour se deconnecter enfermerait un
 * visiteur porteur d un cookie expire dans un etat dont il ne peut pas sortir.
 *
 * Le cookie est ECRASE avec maxAge 0 plutot que simplement oublie : c est le
 * navigateur qui doit le supprimer, sinon il continuerait de l envoyer.
 */
export async function POST() {
  const vide = effacerSession();
  const reponse = NextResponse.json({ ok: true }, { status: 200 });
  reponse.cookies.set(vide.nom, vide.valeur, vide.options);
  return reponse;
}
