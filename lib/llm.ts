/**
 * Acces au modele de langage.
 *
 * TOUTE la specificite Gemini est enfermee ici : forme des URL, en-tete
 * d authentification, nom des champs du corps, structure de la reponse.
 * Le reste du projet ne connait que `askLlm(system, messages)` et le type
 * LlmResult. Changer de fournisseur ne doit toucher que ce fichier.
 *
 * CETTE FONCTION NE JETTE JAMAIS. Tout chemin degrade — cle absente, delai
 * depasse, HTTP non-2xx (quota Google 429 compris), aucun candidat, blocage
 * de securite — renvoie { unavailable: true }. L appelant decide quoi en
 * faire ; ici on ne casse rien.
 *
 * SECRET : la cle voyage dans l en-tete x-goog-api-key, jamais dans l URL.
 * Aucune journalisation ne la touche, et on ne remonte que des codes et des
 * motifs courts.
 *
 * Zero SDK, zero dependance : fetch natif.
 */

// ---------------------------------------------------------------------------
// MODELE EPINGLE — releve du 2026-08-23 (bloc B9).
//
// GET /v1beta/models donnait gemini-3.7-flash comme "flash" le plus recent
// (version 3.7-flash-08-2026, stable, aucun gemini-4 publie). Ecarte sur
// mesure, pas sur impression :
//
//   gemini-3.7-flash   503 200 503 200 503 200 503 429   ->  3/8 en 200
//   gemini-3.6-flash   200 200 200 200 200 200           ->  6/6 en 200
//   gemini-2.5-flash   200 200 200 200 200 200           ->  6/6 en 200
//
// Google repondait « This model is currently experiencing high demand » sur
// les 503. A ce taux, le bot renverrait ses visiteurs vers le formulaire six
// fois sur dix.
//
// RETENU : gemini-3.5-flash, sur un critere de COMPORTEMENT et pas seulement
// de disponibilite. Question « c est combien la carte ? », meme prompt, meme
// catalogue injecte depuis Postgres :
//
//   gemini-3.5-flash        « Notre formule La Carte est à 450.– »
//   gemini-3.5-flash-lite   « La carte est à 450.– chez Nawa Corps »
//   gemini-2.5-flash        « Je suis là pour votre projet de commerce » (esquive)
//
// gemini-2.5-flash applique le deroule imposé si strictement qu il classe
// une question tarifaire sur son propre catalogue en « hors sujet ». Le
// garde-fou tient — il n invente jamais de prix — mais il refuse aussi ceux
// qu il a le droit de donner, ce qui vide de son sens l injection des prix
// depuis la base. La famille 3.x n a pas ce travers.
//
// A RETENIR : le quota se compte PAR MODELE — 20 requetes par jour chacun.
// Si le repli formulaire se declenche en boucle avec un 429 dans le journal,
// ce n est pas la cle qui est morte : c est ce modele-la qui a epuise sa
// journee. Basculer sur un autre modele rend un budget neuf immediatement.
// Corollaire de diagnostic : une sonde a deux tokens peut repondre 200
// pendant que la route, qui envoie 1900 caracteres de prompt, prend un 429.
// Toujours sonder avec le prompt complet.
//
// AVANT TOUT CHANGEMENT DE MODELE : RE-SONDER. Les taux ci-dessus sont dates
// et ne valent que pour le 2026-08-23 ; la congestion se deplace. Refaire la
// mesure — une boucle de six appels par candidat suffit — et remplacer ce
// bloc de commentaire par le nouveau releve, avec sa date.
//
// Ni alias "gemini-flash-latest", ni reessais automatiques :
//  - l alias suit tout seul, donc il pointerait sur 3.7 et son taux d echec,
//    et changerait le comportement du bot sans qu une ligne du depot bouge.
//    Le comportement de ce bot EST le produit : sa version doit etre un commit.
//  - a 40 % de succes par appel il faudrait trois ou quatre reessais, chacun
//    consommant du quota — et le 429 ci-dessus montre que le quota est fini.
//    On echangerait une panne visible contre une lenteur et une facture.
// ---------------------------------------------------------------------------
const MODEL = "gemini-3.5-flash";

// LE REGLAGE DE REFLEXION SUIT LE MODELE — les deux generations ne parlent pas
// la meme langue, et se tromper coute un 400 sec :
//   Gemini 2.5  -> thinkingConfig { thinkingBudget: n }
//                  « thinkingLevel is not supported for this model »
//   Gemini 3.x  -> thinkingConfig { thinkingLevel: "low" | ... }
//                  thinkingBudget y est ACCEPTE puis IGNORE, ce qui est pire
//                  qu un refus : 128 et -1 laissaient tous deux 284+ tokens de
//                  reflexion, donc la troncature passait inapercue.
// Changer MODEL sans changer cette constante casse la route.
const THINKING_CONFIG = { thinkingLevel: "low" };

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 15_000;
// ECART SIGNALE : la spec du bloc B9 disait 300. Ce plafond ne borne pas la
// reponse, il borne REFLEXION + reponse, et sur Gemini 3.x la reflexion ne
// peut pas etre coupee — thinkingLevel "off" est refuse en 400, et "low"
// consomme encore ~250 a 290 tokens sur un tour difficile. Mesure du
// 2026-08-23 sur le tour de recapitulation, meme prompt :
//
//   300  -> finish MAX_TOKENS | pensee 284 | sortie  12   phrase coupee net
//   800  -> finish STOP       | pensee 248 | sortie  68   recapitulatif entier
//   1200 -> finish STOP       | pensee 294 | sortie  61   idem
//
// L intention de la spec — des reponses courtes — est tenue : le modele sort
// 61 a 68 tokens, soit cinq fois moins que les 300 d origine. Desserrer le
// plafond ne rallonge pas les reponses, il laisse la place a une reflexion que
// le modele fait de toute facon.
const MAX_OUTPUT_TOKENS = 800;

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

/** Union discriminee : soit une reponse, soit l indisponibilite. Jamais d exception. */
export type LlmResult = { unavailable: true; reason: string } | { reply: string };

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

function indisponible(reason: string): LlmResult {
  console.warn(`[llm] indisponible — ${reason}`);
  return { unavailable: true, reason };
}

export async function askLlm(system: string, messages: ChatMessage[]): Promise<LlmResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return indisponible("GEMINI_API_KEY absente");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${ENDPOINT}/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: controller.signal,
      // INDISPENSABLE. Next instrumente fetch et met les reponses en cache.
      // Sans cela, deux visiteurs qui ecrivent la meme phrase recoivent la
      // meme reponse recyclee — et surtout, un 503 passager de Google se
      // trouve fige et rejoue indefiniment, ce qui s est produit ici : la
      // route rendait 503 en boucle pendant que le meme code, hors Next,
      // repondait 200 a chaque essai.
      cache: "no-store",
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          // Ces modeles raisonnent avant de repondre, et les tokens de reflexion
          // se PRELEVENT sur maxOutputTokens. Mesure du 2026-08-23 sans ce
          // reglage : thoughtsTokenCount 287, candidatesTokenCount 9,
          // finishReason MAX_TOKENS — il sortait un fragment de son propre
          // raisonnement au lieu d une phrase. Avec : reflexion 0, STOP, et les
          // 300 tokens vont a la reponse visible.
          // La forme du reglage depend du modele : voir THINKING_CONFIG.
          thinkingConfig: THINKING_CONFIG,
        },
      }),
    });

    if (!res.ok) {
      // 429 = quota gratuit Google epuise. Traite comme les autres : repli.
      return indisponible(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as GeminiResponse;

    if (data.promptFeedback?.blockReason) {
      return indisponible(`bloque en amont (${data.promptFeedback.blockReason})`);
    }

    const candidat = data.candidates?.[0];
    if (!candidat) return indisponible("aucun candidat");
    if (candidat.finishReason === "SAFETY") return indisponible("bloque par la securite");

    const reply = (candidat.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!reply) return indisponible(`reponse vide (finishReason ${candidat.finishReason ?? "?"})`);

    return { reply };
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return indisponible(nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})`);
  } finally {
    clearTimeout(timer);
  }
}

/** Expose le modele retenu, pour les preuves et le journal. Jamais la cle. */
export const LLM_MODEL = MODEL;
