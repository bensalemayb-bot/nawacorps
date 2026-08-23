import { prisma } from "@/lib/prisma";

/**
 * System prompt d extraction — bloc B10.
 *
 * Second appel au modele, apres la conversation : il ne parle plus au
 * commercant, il rend un objet. D ou askLlmJson et non askLlm.
 *
 * La liste des libelles de services vient de Postgres a CHAQUE appel, comme le
 * catalogue de prix du prompt de conversation (B9). Le modele ne peut donc
 * ranger le besoin que dans des services qui existent vraiment.
 *
 * Le texte entre les deux marqueurs est verbatim de la spec B10, retours a la
 * ligne compris.
 */

async function buildServiceList(): Promise<string> {
  const services = await prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true },
  });
  return services.map((s) => s.name).join(" ; ");
}

export async function buildExtractPrompt(): Promise<string> {
  const libelles = await buildServiceList();

  // ---- verbatim, bloc B10 ----
  return `Tu extrais des informations d'une conversation entre l'assistant de
Nawa Corps et un commerçant. Réponds UNIQUEMENT avec un objet JSON
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
