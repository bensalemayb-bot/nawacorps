import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { askLlm, llmModel, type LlmProvider } from "@/lib/llm";

/**
 * GET /api/health/chat — l assistant repond-il, et par qui ?
 *
 * A QUOI ELLE SERT. Quand le chatbot renvoie le visiteur vers le formulaire,
 * la cause n est pas lisible depuis le site : cle absente, quota du jour
 * epuise, 429 a la minute, reseau. Cette route pose la question directement au
 * fournisseur et rend un verdict en trois champs — qui repond, avec quel
 * modele, et si ca passe. Le motif d echec est celui que lib/llm.ts a deja
 * formule pour le journal ; on ne le reinterprete pas.
 *
 * POURQUOI DERRIERE L AUTHENTIFICATION ADMIN. Sans garde, ce serait une sonde
 * PUBLIQUE : chaque appel consomme une requete du quota du modele, et ce quota
 * est fini — 20 par modele et par jour cote Gemini. N importe qui pourrait
 * eteindre le chatbot de la journee en rechargeant une URL. La garde passe
 * donc AVANT tout le reste, avant meme de lire l environnement : un
 * non-authentifie n apprend pas quel fournisseur est configure. Meme motif
 * qu au PATCH de /api/admin/leads/[id].
 *
 * NE PAS LA MARTELER, MEME CONNECTE. Cote Groq le plafond est de ~6 requetes
 * par minute, tous visiteurs confondus — c est une limite en TOKENS par
 * minute qui compte l entree plus les max_tokens reserves (releve du
 * 2026-08-24, commentaire de lib/llm.ts). Chaque coup de sonde prend sa part
 * de ce budget et la retire aux vrais visiteurs. Cote Gemini c est pire dans
 * la duree : le quota se compte a la JOURNEE et ne revient pas tout seul.
 * Une sonde par incident, pas une boucle de rafraichissement.
 *
 * CE QU ELLE NE DIT PAS. Elle mesure la DISPONIBILITE, pas le COMPORTEMENT.
 * Deux tokens qui passent ne prouvent pas qu un modele tiendra le deroule, ni
 * meme que la route /api/chat passera — elle envoie, elle, tout le prompt
 * systeme et peut prendre un 429 la ou cette sonde a repondu 200. Avant tout
 * changement de modele, c est le protocole de lib/llm.ts qui fait foi : six
 * appels espaces, prompt complet, historique plausible. Voir docs/chatbot.md.
 *
 * AUCUN SECRET NE SORT D ICI. La reponse ne contient que des booleens, un nom
 * de fournisseur et un nom de modele. Aucune valeur de variable
 * d environnement, jamais — et surtout aucune cle : llmModel() a ete ecrite
 * pour rendre le modele sans jamais toucher a la cle, et les motifs
 * d indisponibilite de lib/llm.ts ne citent que des NOMS de variables
 * (« GEMINI_API_KEY absente ») et des codes HTTP.
 */

/**
 * Sonde volontairement minuscule : deux mots. Le but est de savoir si la cle
 * repond, pas de faire travailler le modele — plus le message est court, moins
 * la sonde ponctionne le budget en tokens par minute qu elle est censee
 * diagnostiquer.
 */
const SONDE_SYSTEME = "Réponds par un seul mot.";
const SONDE_MESSAGE = "ping";

/**
 * Fournisseur actif, normalise EXACTEMENT comme lib/llm.ts le fait dans sa
 * fonction `fournisseur()` : toute valeur autre que "groq" — absente, vide,
 * mal orthographiee — vaut gemini.
 *
 * DUPLICATION ASSUMEE, et il faut la connaitre : `fournisseur()` n est pas
 * exportee, parce que le confinement du fournisseur dans lib/llm.ts est
 * precisement ce que le bloc B10b a construit. Cette route est le seul endroit
 * du depot qui a besoin de NOMMER le fournisseur — c est son objet meme — et
 * l ouvrir a tous pour un diagnostic couterait plus que ces trois lignes.
 * Si la regle change la-bas, elle change ici : les deux se lisent ensemble.
 */
function fournisseurActif(): LlmProvider {
  return process.env.LLM_PROVIDER?.trim().toLowerCase() === "groq" ? "groq" : "gemini";
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const provider = fournisseurActif();
  const model = llmModel();

  // askLlm NE JETTE JAMAIS : soit une reponse, soit { unavailable, reason }.
  // Pas de try/catch a mettre autour, il ne servirait a rien.
  const resultat = await askLlm(SONDE_SYSTEME, [{ role: "user", content: SONDE_MESSAGE }]);

  // 200 MEME QUAND ok VAUT false. La route a fait son travail : elle a une
  // reponse a la question posee. Rendre 503 ferait confondre « le diagnostic
  // a echoue » et « le modele est indisponible », alors que c est justement
  // cette distinction qu on vient chercher.
  return NextResponse.json(
    "unavailable" in resultat
      ? { provider, model, ok: false, reason: resultat.reason }
      : { provider, model, ok: true },
    { status: 200 },
  );
}
