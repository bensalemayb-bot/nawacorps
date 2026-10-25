/**
 * Acces au modele de langage.
 *
 * DEUX FOURNISSEURS, UN SEUL CONTRAT. Le reste du projet ne connait que
 * `askLlm(system, messages)` / `askLlmJson(system, messages)` et les types
 * LlmResult / LlmJsonResult. Quel fournisseur repond derriere — Gemini ou Groq
 * — ne se lit nulle part ailleurs. C etait la promesse du bloc B9 ; B10b la met
 * a l epreuve en ajoutant un second fournisseur sans qu une ligne d appelant
 * bouge.
 *
 * LE CHOIX SE LIT A CHAQUE APPEL, pas au chargement du module. Une constante
 * figee au premier import obligerait a rebuilder pour basculer, et surtout
 * empecherait une preuve d aller-retour entre les deux fournisseurs dans la
 * meme session. ABSENT OU VIDE = gemini : le comportement d avant ce bloc.
 *
 * CES FONCTIONS NE JETTENT JAMAIS, quel que soit le fournisseur. Tout chemin
 * degrade — cle absente, delai depasse, HTTP non-2xx (429 de quota compris),
 * reponse vide, JSON illisible — renvoie { unavailable: true, reason }.
 * Cette uniformite EST la condition de l interchangeabilite : si Groq echouait
 * autrement que Gemini, les appelants devraient savoir lequel repond, et le
 * confinement ne vaudrait plus rien.
 *
 * SECRET : la cle voyage dans un en-tete — x-goog-api-key cote Gemini,
 * Authorization: Bearer cote Groq — jamais dans l URL. Aucune journalisation ne
 * la touche : on ne remonte que des codes et des motifs courts.
 *
 * Zero SDK, zero dependance : fetch natif des deux cotes.
 */

export type LlmProvider = "gemini" | "groq" | "infomaniak";

/**
 * Fournisseur actif. Toute valeur autre que "groq" — absente, vide, mal
 * orthographiee — retombe sur gemini. Un aiguillage silencieux vaut mieux
 * qu un throw : une faute de frappe dans .env ne doit pas eteindre le bot,
 * elle doit le laisser sur le fournisseur d origine.
 */
function fournisseur(): LlmProvider {
  const v = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (v === "groq" || v === "infomaniak") return v;
  return "gemini";
}

const TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// MODELE GEMINI EPINGLE — releve du 2026-08-23 (bloc B9).
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
const MODEL_GEMINI = "gemini-3.5-flash";

// LE REGLAGE DE REFLEXION SUIT LE MODELE — les deux generations ne parlent pas
// la meme langue, et se tromper coute un 400 sec :
//   Gemini 2.5  -> thinkingConfig { thinkingBudget: n }
//                  « thinkingLevel is not supported for this model »
//   Gemini 3.x  -> thinkingConfig { thinkingLevel: "low" | ... }
//                  thinkingBudget y est ACCEPTE puis IGNORE, ce qui est pire
//                  qu un refus : 128 et -1 laissaient tous deux 284+ tokens de
//                  reflexion, donc la troncature passait inapercue.
// Changer MODEL_GEMINI sans changer cette constante casse la route.
const THINKING_CONFIG = { thinkingLevel: "low" };

const ENDPOINT_GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";
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
//
// 800 NE SUFFISAIT PLUS LE 25.10.2026. Le prompt a grossi (grille des
// paliers, regles de controle, ligne CHOIX des reponses suggerees) et la
// reflexion avec lui : en test, Leo a rendu « … liste triee a valider. Il ne s »,
// coupe net au milieu d un mot. 1500 laisse la marge ; la consigne de deux
// phrases, elle, borne toujours la longueur visible. Et si le plafond est
// malgre tout atteint, `couperPhraseInachevee` retire le fragment plutot que
// de l afficher.
const MAX_OUTPUT_TOKENS = 1500;

/**
 * Retire une fin de reponse coupee par le plafond de tokens : on garde le
 * texte jusqu a la derniere fin de phrase (. ! ? ») et on laisse tomber le
 * reste, ligne CHOIX comprise, qui serait de toute facon incomplete. Si
 * aucune phrase entiere n existe, la reponse est rejetee (repli formulaire)
 * plutot que montree en morceaux.
 */
function couperPhraseInachevee(texte: string): string {
  const fin = Math.max(
    texte.lastIndexOf(". "),
    texte.lastIndexOf("? "),
    texte.lastIndexOf("! "),
    texte.lastIndexOf(".\n"),
    texte.lastIndexOf("?\n"),
    texte.lastIndexOf("!\n"),
  );
  if (fin === -1) return "";
  return texte.slice(0, fin + 1).trim();
}

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

async function askGemini(system: string, messages: ChatMessage[]): Promise<LlmResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return indisponible("GEMINI_API_KEY absente");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${ENDPOINT_GEMINI}/${MODEL_GEMINI}:generateContent`, {
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

    const brute = (candidat.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    // Plafond atteint : la derniere phrase est tronquee, on ne la montre pas.
    const reply = candidat.finishReason === "MAX_TOKENS" ? couperPhraseInachevee(brute) : brute;

    if (!reply) return indisponible(`reponse vide (finishReason ${candidat.finishReason ?? "?"})`);

    return { reply };
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return indisponible(nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})`);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// EXTRACTION EN JSON — bloc B10.
//
// askLlm ci-dessus n est PAS touche : la conversation et l extraction ont des
// contraintes opposees. L une doit rendre une phrase a un commercant, l autre
// un objet machine ; l une tolere une reponse approximative, l autre est
// inutilisable si elle n est pas parsable. Deux fonctions, deux contrats.
//
// responseMimeType "application/json" demande au modele de ne produire que du
// JSON. Il n en fait pas une garantie : le JSON.parse reste sous try/catch, et
// une sortie illisible devient { unavailable } comme le reste. L appelant du
// bloc B10 enregistre alors la conversation avec extracted = null — les
// messages du visiteur ne se perdent dans aucun scenario.
//
// 400 tokens suffisent : le schema attendu tient en une dizaine de champs.
// Le modele et le reglage de reflexion sont ceux de MODEL / THINKING_CONFIG.
// ---------------------------------------------------------------------------

const MAX_OUTPUT_TOKENS_JSON = 400;

export type LlmJsonResult = { unavailable: true; reason: string } | { data: unknown };

function indisponibleJson(reason: string): LlmJsonResult {
  console.warn(`[llm:json] indisponible — ${reason}`);
  return { unavailable: true, reason };
}

async function askGeminiJson(system: string, messages: ChatMessage[]): Promise<LlmJsonResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return indisponibleJson("GEMINI_API_KEY absente");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${ENDPOINT_GEMINI}/${MODEL_GEMINI}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: controller.signal,
      cache: "no-store",
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: MAX_OUTPUT_TOKENS_JSON,
          thinkingConfig: THINKING_CONFIG,
        },
      }),
    });

    if (!res.ok) return indisponibleJson(`HTTP ${res.status}`);

    const payload = (await res.json()) as GeminiResponse;

    if (payload.promptFeedback?.blockReason) {
      return indisponibleJson(`bloque en amont (${payload.promptFeedback.blockReason})`);
    }

    const candidat = payload.candidates?.[0];
    if (!candidat) return indisponibleJson("aucun candidat");
    if (candidat.finishReason === "SAFETY") return indisponibleJson("bloque par la securite");

    const brut = (candidat.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!brut) return indisponibleJson(`reponse vide (finishReason ${candidat.finishReason ?? "?"})`);

    try {
      return { data: JSON.parse(brut) };
    } catch {
      // On ne journalise pas `brut` : il contient les propos du visiteur.
      return indisponibleJson(`JSON illisible (${brut.length} caracteres)`);
    }
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return indisponibleJson(nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})`);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// GROQ — bloc B10b.
//
// API au format OpenAI : /chat/completions, un tableau `messages` ou le prompt
// systeme est le premier element, et une reponse en `choices[0].message`.
// Rien de propre a Groq au-dela de l URL, de l en-tete Bearer et du nom du
// modele — c est precisement ce qui rend ce fournisseur peu couteux a ajouter.
//
// POURQUOI UN SECOND FOURNISSEUR : le quota gratuit Gemini se compte PAR
// MODELE et PAR JOUR (20 requetes, cf. le releve B9 plus haut), ce qui suffit
// a bloquer une session de tests. Groq ne remplace pas Gemini — il le double.
// Les deux restent utilisables, et LLM_PROVIDER decide lequel repond.
//
// MODELE EPINGLE — releve du 2026-08-24 (bloc B10b).
//
// GET /openai/v1/models rendait 13 entrees. Ecartees sans mesure, faute d etre
// des modeles de conversation : whisper-* (transcription), orpheus-* (synthese
// vocale), llama-prompt-guard-2-* (classifieurs, 512 de contexte), allam-2-7b
// (4096 de contexte). Ecartes aussi groq/compound et groq/compound-mini : ce
// sont des systemes agentiques a outils integres, recherche web comprise — un
// bot de qualification doit tenir dans son prompt et son catalogue, pas aller
// chercher dehors.
//
// Restaient openai/gpt-oss-120b, openai/gpt-oss-20b, qwen/qwen3.6-27b.
// RETENU : openai/gpt-oss-120b, le plus gros des trois, 131072 de contexte.
//
//   disponibilite   200 200 200 200 200 200   ->  6/6, 600 a 1060 ms
//
// COMPORTEMENT, meme critere qu au bloc B9 — question tarifaire sur son propre
// catalogue, posee EN COURS de deroule et non au premier tour :
//
//   « La refonte de votre carte coute 450 CHF. Pour quand en avez-vous besoin ? »
//
// Prix exact du catalogue Postgres, une seule question, francais, deroule qui
// avance. C est le niveau de gemini-3.5-flash, pas l esquive de gemini-2.5.
//
// PIEGE DE MESURE, a lire avant de re-sonder : la premiere sonde tirait les six
// appels d affilee et rendait 5/6, le sixieme en 429. Ce n etait pas le modele
// mais la limite TPM — TOKENS PAR MINUTE, 8000 en tier on_demand — qui compte
// l entree PLUS les max_tokens RESERVES, soit ~1300 par appel ici. Six tirs
// immediats la saturent ; espacer de 13 s donne 6/6.
//
//   Consequence en production : ~6 requetes par minute, tous visiteurs
//   confondus. Au-dela, 429 — donc { unavailable } et repli formulaire, jamais
//   d erreur nue. C est l inverse du quota Gemini : Gemini s epuise pour la
//   JOURNEE, Groq se regule a la MINUTE et revient tout seul.
//
// A RETENIR : la premiere sonde m a fait accuser le modele d une esquive qui
// etait la mienne. Je posais la question de prix au tout premier tour, la ou le
// prompt impose « 1. Demande quel type de commerce » — le modele obeissait. Le
// corollaire B9 « toujours sonder avec le prompt complet » en appelle un autre :
// sonder aussi avec un HISTORIQUE plausible, sinon on mesure sa propre erreur.
//
// AVANT TOUT CHANGEMENT DE MODELE : RE-SONDER, six appels espaces, et remplacer
// ce bloc par le nouveau releve avec sa date.
// ---------------------------------------------------------------------------
const MODEL_GROQ = "openai/gpt-oss-120b";

// MODELE DE SECOURS, POUR LE 429 SEULEMENT — releve du 25.10.2026 : chez Groq
// le plafond par minute se compte PAR MODELE (8000 tokens chacun, en-tete
// x-ratelimit-limit-tokens). Le prompt de Leo pese ~3200 tokens, plus les
// 1200 reserves : le modele principal sature des le deuxieme message d une
// meme minute. Le petit frere a son propre compteur et le meme format de
// sortie : un 429 sur l un bascule sur l autre, sans attendre.
const MODEL_GROQ_SECOURS = "openai/gpt-oss-20b";

const ENDPOINT_GROQ = "https://api.groq.com/openai/v1/chat/completions";

// MODE JSON NATIF. response_format {type:"json_object"} contraint la sortie a
// du JSON parsable — mais tous les modeles Groq ne l acceptent pas, et ceux
// qui le refusent repondent 400, donc { unavailable } et une extraction perdue.
// Ce drapeau est donc MESURE, pas suppose. Releve du 2026-08-24 sur
// openai/gpt-oss-120b, prompt d extraction complet : HTTP 200, sortie
// parsable, schema respecte (les dix champs, urgency et quality_score
// compris). Le prompt d extraction contient deja le mot « JSON » —
// « Reponds UNIQUEMENT avec un objet JSON » — ce que le mode json_object
// des API au format OpenAI EXIGE : sans lui, la requete part en 400.
// A false, on ne garde que la consigne-JSON deja presente dans le prompt
// d extraction (« Reponds UNIQUEMENT avec un objet JSON ») ; le JSON.parse sous
// try/catch couvre identiquement les deux cas, c est tout son interet.
const GROQ_MODE_JSON = true;

// Meme plafond que cote Gemini, pour une raison differente : Groq ne preleve
// pas de tokens de reflexion sur ce budget, donc 800 y est confortable la ou
// c etait juste necessaire cote Gemini. Garder le meme chiffre evite qu une
// reponse change de longueur en changeant de fournisseur.
//
// CETTE PHRASE EST DEVENUE FAUSSE LE 25.10.2026 : openai/gpt-oss-120b est un
// modele qui RAISONNE, et sur Groq ses tokens de raisonnement se prelevent
// aussi sur max_tokens. En test, avec le prompt actuel, Leo a rendu une
// reponse vide (finish_reason "length") et l extraction JSON de la
// finalisation est tombee en HTTP 400 (JSON tronque). D ou un plafond releve
// a 1200 et un effort de raisonnement « low » : la longueur visible reste
// bornee par la consigne de deux phrases du prompt.
// PAS PLUS HAUT : Groq compte dans son plafond par minute (8000 tokens en
// tier on_demand, cf. .env.example) l entree PLUS les max_tokens RESERVES.
// A 2000, un seul visiteur saturait le compte en deux messages (429).
const MAX_TOKENS_GROQ = 1200;
const EFFORT_RAISONNEMENT_GROQ = "low";

type GroqResponse = {
  choices?: { message?: { content?: string }; finish_reason?: string }[];
};

/**
 * Corps commun aux deux appels Groq. Le prompt systeme devient le premier
 * message role "system" et l historique suit tel quel : les roles "user" et
 * "assistant" de ChatMessage sont deja ceux du format OpenAI, aucune
 * traduction n est necessaire — contrairement a Gemini, ou "assistant" doit
 * devenir "model".
 */
function corpsGroq(system: string, messages: ChatMessage[], json: boolean, model = MODEL_GROQ) {
  return JSON.stringify({
    model,
    messages: [{ role: "system", content: system }, ...messages],
    max_tokens: MAX_TOKENS_GROQ,
    reasoning_effort: EFFORT_RAISONNEMENT_GROQ,
    ...(json ? { response_format: { type: "json_object" } } : {}),
  });
}

/** En-tetes communs. La cle ne sort jamais d ici. */
const entetesGroq = (key: string) => ({
  "content-type": "application/json",
  authorization: `Bearer ${key}`,
});

async function askGroq(system: string, messages: ChatMessage[], model = MODEL_GROQ): Promise<LlmResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return indisponible("GROQ_API_KEY absente");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT_GROQ, {
      method: "POST",
      headers: entetesGroq(key),
      signal: controller.signal,
      // INDISPENSABLE, pour la meme raison que cote Gemini : Next instrumente
      // fetch et met les reponses en cache. Sans cela, deux visiteurs qui
      // ecrivent la meme phrase recoivent la meme reponse recyclee, et un
      // incident passager se trouve fige et rejoue indefiniment.
      cache: "no-store",
      body: corpsGroq(system, messages, false, model),
    });

    // 429 = quota Groq epuise. Traite comme les autres : repli, jamais de throw.
    if (!res.ok) return indisponible(`HTTP ${res.status}`);

    const data = (await res.json()) as GroqResponse;
    const choix = data.choices?.[0];
    if (!choix) return indisponible("aucun choix");

    const brute = (choix.message?.content ?? "").trim();
    // Meme garde que cote Gemini : une reponse coupee par max_tokens perd sa
    // derniere phrase inachevee.
    const reply = choix.finish_reason === "length" ? couperPhraseInachevee(brute) : brute;
    if (!reply) return indisponible(`reponse vide (finish_reason ${choix.finish_reason ?? "?"})`);

    return { reply };
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return indisponible(nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})`);
  } finally {
    clearTimeout(timer);
  }
}

async function askGroqJson(system: string, messages: ChatMessage[], model = MODEL_GROQ): Promise<LlmJsonResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return indisponibleJson("GROQ_API_KEY absente");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT_GROQ, {
      method: "POST",
      headers: entetesGroq(key),
      signal: controller.signal,
      cache: "no-store",
      body: corpsGroq(system, messages, GROQ_MODE_JSON, model),
    });

    if (!res.ok) return indisponibleJson(`HTTP ${res.status}`);

    const data = (await res.json()) as GroqResponse;
    const choix = data.choices?.[0];
    if (!choix) return indisponibleJson("aucun choix");

    const brut = (choix.message?.content ?? "").trim();
    if (!brut) return indisponibleJson(`reponse vide (finish_reason ${choix.finish_reason ?? "?"})`);

    try {
      return { data: JSON.parse(brut) };
    } catch {
      // On ne journalise pas `brut` : il contient les propos du visiteur.
      return indisponibleJson(`JSON illisible (${brut.length} caracteres)`);
    }
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return indisponibleJson(nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})`);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// INFOMANIAK — modeles heberges EN SUISSE, offre PAYANTE (ajout du 25.10.2026).
//
// Pourquoi : le site promet « Les donnees de votre assistant sont hebergees en
// Suisse ». Gemini et Groq (offres gratuites, serveurs hors de Suisse, donnees
// potentiellement reutilisees) ne peuvent pas porter les assistants vendus aux
// clients. Infomaniak (Geneve) expose ses modeles via une API compatible
// OpenAI, facturee a l usage, sans reutilisation des donnees pour
// l entrainement (a confirmer dans leurs conditions au moment du contrat).
//
// Tout se regle par l environnement, rien n est en dur :
//   LLM_PROVIDER=infomaniak
//   INFOMANIAK_AI_TOKEN       jeton API avec le scope « ai-tools »
//   INFOMANIAK_AI_PRODUCT_ID  Manager > Cloud Computing > AI Tools
//   INFOMANIAK_AI_MODEL       nom du modele tel que liste par Infomaniak
//   INFOMANIAK_AI_BASE_URL    optionnel ; la doc publique montre deux versions
//                             de chemin (/1/ et /2/), d ou la porte de sortie.
// Ni reasoning_effort ni response_format : non garantis par cette API (retours
// de la communaute), le mode JSON s appuie donc sur la consigne du prompt.
// ---------------------------------------------------------------------------

const MAX_TOKENS_INFOMANIAK = 1200;

function modeleInfomaniak(): string {
  return process.env.INFOMANIAK_AI_MODEL?.trim() || "(INFOMANIAK_AI_MODEL absent)";
}

function endpointInfomaniak(): string | null {
  const base = process.env.INFOMANIAK_AI_BASE_URL?.trim();
  if (base) return `${base.replace(/\/$/, "")}/chat/completions`;
  const produit = process.env.INFOMANIAK_AI_PRODUCT_ID?.trim();
  if (!produit) return null;
  return `https://api.infomaniak.com/1/ai/${produit}/openai/chat/completions`;
}

async function appelInfomaniak(
  system: string,
  messages: ChatMessage[],
): Promise<{ ok: true; texte: string; fin?: string } | { ok: false; raison: string }> {
  const jeton = process.env.INFOMANIAK_AI_TOKEN;
  const endpoint = endpointInfomaniak();
  if (!jeton) return { ok: false, raison: "INFOMANIAK_AI_TOKEN absent" };
  if (!endpoint) return { ok: false, raison: "INFOMANIAK_AI_PRODUCT_ID absent" };
  if (!process.env.INFOMANIAK_AI_MODEL?.trim()) return { ok: false, raison: "INFOMANIAK_AI_MODEL absent" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${jeton}` },
      signal: controller.signal,
      // Meme raison que Gemini et Groq : pas de cache de fetch par Next.
      cache: "no-store",
      body: JSON.stringify({
        model: modeleInfomaniak(),
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: MAX_TOKENS_INFOMANIAK,
      }),
    });
    if (!res.ok) return { ok: false, raison: `HTTP ${res.status}` };
    const data = (await res.json()) as GroqResponse;
    const choix = data.choices?.[0];
    if (!choix) return { ok: false, raison: "aucun choix" };
    return { ok: true, texte: (choix.message?.content ?? "").trim(), fin: choix.finish_reason };
  } catch (e) {
    const nom = e instanceof Error ? e.name : "inconnue";
    return { ok: false, raison: nom === "AbortError" ? "delai de 15 s depasse" : `reseau (${nom})` };
  } finally {
    clearTimeout(timer);
  }
}

async function askInfomaniak(system: string, messages: ChatMessage[]): Promise<LlmResult> {
  const r = await appelInfomaniak(system, messages);
  if (!r.ok) return indisponible(r.raison);
  const reply = r.fin === "length" ? couperPhraseInachevee(r.texte) : r.texte;
  if (!reply) return indisponible(`reponse vide (finish_reason ${r.fin ?? "?"})`);
  return { reply };
}

async function askInfomaniakJson(system: string, messages: ChatMessage[]): Promise<LlmJsonResult> {
  const r = await appelInfomaniak(system, messages);
  if (!r.ok) return indisponibleJson(r.raison);
  // Sans response_format, le modele entoure parfois le JSON de ```json : on
  // prend ce qui va de la premiere accolade a la derniere.
  const debut = r.texte.indexOf("{");
  const fin = r.texte.lastIndexOf("}");
  if (debut === -1 || fin <= debut) return indisponibleJson("aucun objet JSON");
  try {
    return { data: JSON.parse(r.texte.slice(debut, fin + 1)) };
  } catch {
    // On ne journalise pas le texte : il contient les propos du visiteur.
    return indisponibleJson(`JSON illisible (${r.texte.length} caracteres)`);
  }
}

// ---------------------------------------------------------------------------
// ROUTAGE — le seul endroit du depot qui sait qu il existe deux fournisseurs.
// Les signatures ne changent pas d un iota : c est tout l interet du bloc.
// ---------------------------------------------------------------------------

/**
 * UN SECOND ESSAI, ET UN SEUL, QUAND LE FOURNISSEUR DIT 429.
 *
 * Mesure du 25.10.2026 : trois messages envoyes a la suite ont fait tomber le
 * troisieme en 429 chez Groq (debit par minute du compte), et le visiteur
 * voyait « Assistant indisponible » au milieu d une conversation qui marchait.
 * Une pause de 3 s suffit d ordinaire a repasser sous le plafond ; au-dela, le
 * repli formulaire reste la bonne reponse. Un seul essai, pour ne pas
 * allonger l attente au-dela du delai de la route.
 */
// 6 s et non plus 3 : Groq libere son compteur au fil de la minute, et le
// releve du 25.10.2026 (six messages en rafale) montre que 3 s ne suffisaient
// pas une fois les deux modeles satures.
const PAUSE_AVANT_REESSAI_MS = 6000;

export async function askLlm(system: string, messages: ChatMessage[]): Promise<LlmResult> {
  const demander = () => {
    const f = fournisseur();
    if (f === "infomaniak") return askInfomaniak(system, messages);
    return f === "groq" ? askGroq(system, messages) : askGemini(system, messages);
  };
  const premier = await demander();
  if ("unavailable" in premier && premier.reason === "HTTP 429") {
    // Chez Groq, le modele de secours a son propre compteur : on bascule
    // tout de suite (cf. MODEL_GROQ_SECOURS) avant de se resoudre a attendre.
    if (fournisseur() === "groq") {
      // Seule une reponse reussie du secours est gardee : gpt-oss-20b rend
      // parfois un 400 (« model called a tool ») ; on retombe alors sur
      // l attente et le second essai du modele principal.
      const secours = await askGroq(system, messages, MODEL_GROQ_SECOURS);
      if (!("unavailable" in secours)) return secours;
    }
    await new Promise((r) => setTimeout(r, PAUSE_AVANT_REESSAI_MS));
    return demander();
  }
  return premier;
}

export async function askLlmJson(system: string, messages: ChatMessage[]): Promise<LlmJsonResult> {
  const f = fournisseur();
  if (f === "infomaniak") return askInfomaniakJson(system, messages);
  if (f !== "groq") return askGeminiJson(system, messages);
  // La finalisation (extraction du lead) suit la meme bascule que la
  // conversation : c est elle qui part juste apres le dernier message, donc
  // au moment ou le compteur du modele principal est le plus charge.
  const premier = await askGroqJson(system, messages);
  if ("unavailable" in premier && premier.reason === "HTTP 429") {
    return askGroqJson(system, messages, MODEL_GROQ_SECOURS);
  }
  return premier;
}

/** Expose le modele actif, pour les preuves et le journal. Jamais la cle. */
export function llmModel(): string {
  const f = fournisseur();
  if (f === "infomaniak") return modeleInfomaniak();
  return f === "groq" ? MODEL_GROQ : MODEL_GEMINI;
}
