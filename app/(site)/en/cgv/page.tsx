import type { Metadata } from "next";
import { corpsCgv, metadataCgv } from "../../cgv/page";

/**
 * /en/cgv — LA JUMELLE ANGLAISE DES CONDITIONS GENERALES DE VENTE.
 *
 * Le corps et les metadonnees vivent dans app/(site)/cgv/page.tsx, colonne
 * anglaise de `TEXTES` comprise : une clause ajoutee la-bas l est ici du meme
 * coup. L URL garde son segment francais, pour la raison detaillee en tete de
 * app/(site)/en/mentions-legales/page.tsx.
 *
 * `dynamic` EST REDECLARE : la configuration de segment se lit sur le fichier
 * de la route, pas sur le module importe. Sans lui, le montant de la mise en
 * place ne serait pas relu en base a chaque requete.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataCgv("en");

export default async function CgvEn() {
  return corpsCgv("en");
}
