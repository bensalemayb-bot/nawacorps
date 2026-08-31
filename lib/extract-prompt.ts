import { nomService } from "@/lib/catalogue";
import type { Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

/**
 * System prompt d extraction — bloc B10.
 *
 * Second appel au modele, apres la conversation : il ne parle plus au
 * visiteur, il rend un objet. D ou askLlmJson et non askLlm.
 *
 * La liste des libelles de services vient de Postgres a CHAQUE appel, comme le
 * catalogue de prix du prompt de conversation (B9). Le modele ne peut donc
 * ranger le besoin que dans des services qui existent vraiment.
 *
 * >>> TROIS CHOSES NE CHANGENT PAS D UNE LANGUE A L AUTRE. <<<
 *
 *  1. LE SCHEMA — les neuf memes cles, ecrites pareil. Elles sont relues par
 *     `SchemaExtraction` dans app/api/chat/finalize/route.ts : une cle
 *     traduite (« nom », « telephone ») ferait echouer le parse, et la
 *     conversation partirait en « non analysee » sans que rien ne le signale.
 *  2. LES VALEURS D `urgency` — `immediat`, `ce_trimestre`, `plus_tard`,
 *     `inconnu`. Ce sont des JETONS, pas des mots : le meme `z.enum` les
 *     valide dans les deux langues. Le prompt anglais le dit explicitement,
 *     parce qu un modele qui redige en anglais traduit spontanement
 *     « immediate ».
 *  3. LE BAREME DE `quality_score` — 5 / 3 / 1 aux memes conditions. Le score
 *     s affiche en etoiles dans la notification Telegram et dans /admin ; deux
 *     baremes donneraient deux echelles pour une seule colonne.
 *
 * CE QUI CHANGE, EN REVANCHE : la langue du `need_summary`, et celle des
 * libelles de services fournis. Le resume reprend les mots du visiteur — le
 * traduire en francais serait une reecriture, donc une occasion d inventer, ce
 * que la premiere regle du prompt interdit. Une conversation anglaise se
 * resume donc en anglais dans `Conversation.summary` et `Lead.needSummary`, et
 * c est visible tel quel dans le back-office francais. C est le compromis
 * assume : mieux vaut un resume fidele dans la langue du client qu une
 * traduction faite par un modele a qui on demande par ailleurs de n inventer
 * RIEN.
 *
 * LA CONSIGNE « Réponds UNIQUEMENT avec un objet JSON valide » EST OBLIGATOIRE
 * DANS LES DEUX LANGUES. Le mode `json_object` des API au format OpenAI
 * (GROQ_MODE_JSON, lib/llm.ts) EXIGE que le mot « JSON » figure dans le
 * prompt : sans lui la requete part en 400, donc `{ unavailable }`, donc une
 * extraction perdue. La version anglaise dit « Reply ONLY with a valid JSON
 * object » — le mot y est, et il doit y rester.
 *
 * Le texte entre les marqueurs de chaque langue est verbatim de la spec B10,
 * retours a la ligne compris.
 */

/**
 * Les libelles autorises, dans la langue de la conversation.
 *
 * Meme lecture que le prompt de conversation : `nomService` (lib/catalogue.ts),
 * repli sur le francais compris. Les trois formules restent donc « La
 * Vitrine », « Le Site », « L'Assistant » en anglais aussi — `nameEn` y est
 * null volontairement.
 *
 * CONSEQUENCE A CONNAITRE : le tableau `services` que rend le modele porte les
 * libelles de la langue du visiteur, et il atterrit tel quel dans
 * `Conversation.extracted`. Le back-office affiche donc des libelles anglais
 * pour une conversation anglaise. C est voulu — l alternative aurait ete de
 * fournir les libelles francais a un modele qui lit de l anglais, ce qui
 * l aurait fait choisir entre traduire (interdit) et recopier une chaine
 * qu il ne voit nulle part dans la conversation.
 *
 * `select` reduit a deux colonnes : c est tout ce que `nomService` demande.
 */
async function buildServiceList(locale: Locale): Promise<string> {
  const services = await prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, nameEn: true },
  });
  return services.map((s) => nomService(s, locale)).join(" ; ");
}

/**
 * LA `locale` EST OBLIGATOIRE, meme raison qu a `buildSystemPrompt` : l unique
 * appelant (app/api/chat/finalize/route.ts) est mis a jour dans le meme
 * changement, et un defaut ne ferait que rendre silencieux l oubli de la faire
 * descendre.
 */
export async function buildExtractPrompt(locale: Locale): Promise<string> {
  const libelles = await buildServiceList(locale);
  return locale === "en" ? extractEn(libelles) : extractFr(libelles);
}

function extractFr(libelles: string): string {
  // ---- verbatim, bloc B10 ----
  return `Tu extrais des informations d'une conversation entre l'assistant de
Nawa Corps et un dirigeant de PME. Réponds UNIQUEMENT avec un objet JSON
valide, sans texte autour, exactement ce schéma :
{"name": string|null, "phone": string|null, "email": string|null,
 "commerce_type": string|null, "commerce_name": string|null,
 "need_summary": string (2 phrases max, en français),
 "services": string[] (parmi les libellés de services fournis),
 "urgency": "immediat"|"ce_trimestre"|"plus_tard"|"inconnu",
 "quality_score": 1|2|3|4|5}
Règles : n'invente RIEN — une information absente de la conversation
vaut null ; le téléphone est recopié tel qu'écrit par le visiteur ;
quality_score : 5 = besoin clair + coordonnées + urgence, 3 = besoin
clair sans coordonnées, 1 = vague ou hors sujet.

Libellés de services disponibles : ${libelles}`;
  // ---- fin verbatim ----
}

/**
 * LA VERSION ANGLAISE — memes neuf cles, meme barème, memes jetons d urgence.
 *
 * Les noms de cles et les valeurs d `urgency` sont RECOPIES, pas traduits :
 * ce sont eux que relit `SchemaExtraction` cote route.
 */
function extractEn(libelles: string): string {
  // ---- verbatim, version anglaise du bloc B10 ----
  return `You extract information from a conversation between the assistant of
Nawa Corps and a small business owner. Reply ONLY with a valid JSON
object, with no text around it, exactly this schema:
{"name": string|null, "phone": string|null, "email": string|null,
 "commerce_type": string|null, "commerce_name": string|null,
 "need_summary": string (2 sentences max, in English),
 "services": string[] (from the service labels supplied below),
 "urgency": "immediat"|"ce_trimestre"|"plus_tard"|"inconnu",
 "quality_score": 1|2|3|4|5}
Rules: invent NOTHING — information absent from the conversation is
null ; the phone number is copied exactly as the visitor wrote it ;
the key names and the four "urgency" values above are fixed tokens —
copy them as they are, never translate them ;
quality_score: 5 = clear need + contact details + urgency, 3 = clear
need without contact details, 1 = vague or off topic.

Service labels available: ${libelles}`;
  // ---- fin verbatim ----
}
