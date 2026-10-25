import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt, genere.
 *
 * Il n en existait aucun : les moteurs decouvraient le site au flair, sans
 * savoir ou etait le plan ni ce qu il fallait laisser tranquille.
 *
 * Deux interdictions, pour deux raisons differentes :
 *
 *  - /admin porte deja `robots: { index: false, follow: false }` dans son
 *    layout. Le repeter ici n est pas redondant : la balise meta demande de
 *    VISITER la page pour etre lue, robots.txt evite le passage. Ceinture et
 *    bretelles, et aucune des deux n est une mesure de securite — c est
 *    l authentification qui protege.
 *
 *  - /api n a jamais rien a offrir a un moteur : ce sont des endpoints JSON,
 *    dont plusieurs mutent l etat. Les faire crawler ne sert personne.
 *
 * LES ROBOTS D IA SONT AUTORISES NOMMEMENT (25 octobre 2026). Le but d Ayoub
 * est d etre CITE des qu on parle d automatisation IA pour PME a Geneve : un
 * studio qui vend un assistant IA a interet a etre lu par les moteurs de
 * reponse. La regle `*` les laissait deja passer ; on les nomme quand meme,
 * pour deux raisons :
 *  1. un robot qui trouve un groupe a son nom IGNORE le groupe `*` (RFC 9309,
 *     §2.2.1) — chaque groupe repete donc le meme `disallow` /admin /api, sans
 *     quoi le nommer lui ouvrirait l admin ;
 *  2. le jour ou quelqu un ajoute un blocage general, ces lignes disent noir
 *     sur blanc que l ouverture aux IA est une decision, pas un oubli.
 *
 * Ils sont groupes par role, pour qu on sache ce qu on ouvre :
 *  - RECHERCHE ET CITATION (le robot va chercher la page pour repondre a une
 *    question, avec un lien) : OAI-SearchBot et ChatGPT-User (ChatGPT),
 *    PerplexityBot, Claude-SearchBot (Claude), Bingbot (Bing, donc Copilot).
 *  - ENTRAINEMENT (le texte nourrit les modeles) : GPTBot, ClaudeBot,
 *    anthropic-ai (ancien nom, encore lu), Google-Extended (Gemini ; ce
 *    jeton ne touche PAS au classement Google Search), Applebot-Extended
 *    (Apple Intelligence).
 *
 * POURQUOI NE PAS BLOQUER L ENTRAINEMENT, ni CCBot (Common Crawl) : etre cite
 * vaut mieux que ne pas servir a l entrainement. Le site ne publie rien de
 * secret — une offre, des prix, une methode — et un modele qui a deja lu que
 * Nawa Corps installe des assistants IA a Geneve peut le dire meme sans
 * chercher en ligne. Common Crawl est en outre l un des corpus les plus
 * repris par les modeles ouverts : le bloquer retirerait le studio de leurs
 * reponses sans rien proteger. CCBot reste donc sous la regle `*`, sans
 * groupe a son nom. Revenir sur ce choix est une decision commerciale, pas une
 * correction technique.
 *
 * /llms.txt (app/llms.txt/route.ts) leur resume le site, et /tarifs.md
 * (app/tarifs.md/route.ts) leur donne les prix lus en base.
 *
 * PAS DE LIGNE `Host:` (retiree le 25 octobre 2026, audit CRO/SEO v2 §3.7) :
 * elle n est pas standard, Google l ignore, et la canonique de chaque page
 * dit deja quel domaine fait foi. Le plan (`sitemap`) suit SITE_URL
 * (lib/site.ts), qui leve au build de production si NEXT_PUBLIC_SITE_URL
 * manque : il ne peut pas pointer sur localhost en ligne.
 *
 * Ce fichier est un Route Handler mis en cache par Next tant qu il n utilise
 * aucune API de requete — ce qui est le cas ici.
 */
const ROBOTS_IA = [
  // Recherche et citation.
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Claude-SearchBot",
  "Bingbot",
  // Entrainement.
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
];

const INTERDITS = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: INTERDITS },
      { userAgent: ROBOTS_IA, allow: "/", disallow: INTERDITS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
