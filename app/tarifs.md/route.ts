import {
  lireMiseEnPlace,
  lirePaliers,
  texteOffreIntroduction,
} from "@/lib/catalogue";
import { mentionTva, suffixeMensuel } from "@/lib/format";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * /tarifs.md — LES PRIX DU STUDIO, EN MARKDOWN, POUR LES AGENTS D IA.
 *
 * POURQUOI CE FICHIER : quand on demande a ChatGPT ou Perplexity « combien
 * coute un assistant IA pour une PME a Geneve », le moteur cherche une page
 * qui donne un montant net, sans JavaScript a executer. /services le dit,
 * mais au milieu d une mise en page ; ici le prix tient en quelques lignes
 * citables, chacune avec sa mention de TVA. /llms.txt y renvoie.
 *
 * MEME MODELE QUE app/llms.txt/route.ts, et pour les memes raisons : les
 * URL sont absolues (SITE_URL), et TOUT MONTANT EST LU EN BASE
 * (lib/catalogue.ts) — corriger un prix depuis /admin le corrige ici a la
 * requete suivante. Rendu a chaque requete (handler GET dynamique par defaut),
 * sans `revalidate`, exactement comme llms.txt.
 *
 * SANS BASE, LE FICHIER RESTE VRAI : `lireMiseEnPlace` et `lirePaliers` ne
 * levent jamais, et chaque ligne se referme alors sans montant plutot que sur
 * un chiffre invente. L offre d introduction disparait seule apres le
 * 31.01.2027 (`texteOffreIntroduction`).
 *
 * Hors du sitemap, comme llms.txt : c est un fichier technique, pas une page.
 * Le proxy (proxy.ts) ne passe pas ici — son `matcher` exclut les chemins qui
 * contiennent un point.
 */
export async function GET() {
  const [montant, paliers] = await Promise.all([lireMiseEnPlace(), lirePaliers("fr")]);
  const url = (chemin: string) => `${SITE_URL}${chemin}`;
  const tva = mentionTva("fr");
  const mois = suffixeMensuel("fr");

  const miseEnPlace = montant
    ? `- **${montant}**, ${tva}, payée une seule fois, **après l'essai**, et seulement si le relevé convient.`
    : "- Payée une seule fois, **après l'essai**, et seulement si le relevé convient. Montant sur /services.";

  const grille = paliers
    ? paliers
        .map((p) => `- **${p.nom} — ${p.montant}${mois}**, ${tva}. ${p.description}`.trimEnd())
        .join("\n")
    : "- Trois paliers selon le volume ; les montants sont affichés sur /services.";

  const introduction = texteOffreIntroduction(paliers, "fr");

  const texte = `# Tarifs — ${SITE_NAME}

> ${SITE_NAME}, studio genevois, installe dans les PME de Genève et de Suisse romande un assistant IA qui connaît déjà leur métier : il répond aux demandes, relance, prépare ; le patron valide tout. Prix en francs suisses (CHF), ${tva}.

## Démo

- Gratuite. L'assistant est montré sur des demandes types du métier du client, sans rien à préparer et sans accès à ses outils.

## Essai

- Deux semaines, gratuit, sur les vraies demandes du client. Un relevé chaque lundi.

## Mise en place

${miseEnPlace}

## Abonnement mensuel

${grille}
- Sans engagement, résiliable chaque mois.
- Le palier se fixe par écrit à la fin de la démo.
${introduction ? `\n## Offre d'introduction\n\n- ${introduction}\n` : ""}
## En savoir plus

- [L'assistant en détail et les prix](${url("/services")})
- [Demander une démo](${url("/devis")})
- [Résumé du site pour les agents d'IA](${url("/llms.txt")})
- E-mail : ${CONTACT.email}
`;

  return new Response(texte, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
