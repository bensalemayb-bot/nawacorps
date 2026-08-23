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
// (version 3.7-flash-08-2026, stable, aucun gemini-4 publie). Il a ete ecarte
// sur mesure, pas sur impression :
//
//   gemini-3.7-flash   503 200 503 200 503 200 503 429   ->  3/8 en 200
//   gemini-3.6-flash   200 200 200 200 200 200           ->  6/6 en 200
//
// Google repondait « This model is currently experiencing high demand » sur
// les 503, et un 429 de quota gratuit sur le dernier appel. A ce taux, le bot
// renverrait ses visiteurs vers le formulaire six fois sur dix.
//
// gemini-3.6-flash : version 3.6-flash-07-2026, un cran en arriere, memes
// limites de contexte, meme famille, meme palier gratuit.
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
const MODEL = "gemini-3.6-flash";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 15_000;
const MAX_OUTPUT_TOKENS = 300;

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
          // La famille Gemini 3 raisonne avant de repondre, et ces tokens de
          // reflexion se PRELEVENT sur maxOutputTokens. Mesure du 2026-08-23,
          // sans ce reglage : thoughtsTokenCount 287, candidatesTokenCount 9,
          // finishReason MAX_TOKENS — il sortait un fragment de son propre
          // raisonnement, pas une phrase.
          // Avec thinkingLevel "low" : reflexion 0, finishReason STOP, les 300
          // tokens vont a la reponse visible.
          //
          // C est bien thinkingLevel et non thinkingBudget : ce dernier est le
          // parametre de Gemini 2.5, ignore par la famille 3.x (mesure : 128 et
          // -1 laissent tous deux 284+ tokens de reflexion). Et thinkingBudget
          // a 0 est refuse en 400 par ce modele.
          thinkingConfig: { thinkingLevel: "low" },
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
