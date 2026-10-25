/**
 * PURGE DES DONNEES PERSONNELLES ARRIVEES A ECHEANCE.
 *
 * C est le script qui rend VRAIE la politique de confidentialite : elle
 * annonce des durees de conservation (lib/conservation.ts), et sans lui rien
 * n etait jamais efface — la base gardait chaque demande, chaque transcription
 * de Leo et chaque empreinte d IP indefiniment, ce que la nLPD (art. 6 al. 4)
 * interdit des que la donnee n est plus necessaire.
 *
 * CE QU IL SUPPRIME, dans cet ordre :
 *  1. les conversations de Leo plus vieilles que `conversationsMois`, sauf
 *     celles rattachees a une demande devenue cliente (statut WON) ;
 *  2. les demandes (Lead) plus vieilles que `leadsMois`, sauf les clientes
 *     (WON) : leurs donnees servent alors au contrat et suivent ses delais,
 *     pas ceux d une prospection ;
 *  3. le journal anti-abus (RateLimit) plus vieux que `rateLimitJours`.
 * L ordre n est pas critique — la cle Conversation.leadId est en
 * ON DELETE SET NULL — mais il evite de laisser un instant une conversation
 * orpheline d une demande qu on vient d effacer.
 *
 * CE QU IL NE TOUCHE PAS : la table Service (le catalogue), et tout ce qui vit
 * hors de la base — les notifications Telegram, les e-mails, les journaux de
 * Vercel. Ceux-la se purgent a la main (docs/legal/CONFORMITE-2026-10-25.md).
 *
 * UNIQUEMENT DES deleteMany SUR createdAt. Aucun upsert, aucune ecriture :
 * le script ne peut que retirer des lignes echues.
 *
 * ATTENTION : .env.local pointe sur la base de PRODUCTION (Neon). Lancer ce
 * script efface pour de bon. Toujours commencer a blanc :
 *
 *   npx tsx scripts/purger-donnees.ts --a-blanc   # compte, n efface rien
 *   npx tsx scripts/purger-donnees.ts             # efface
 *
 * A lancer regulierement — au moins une fois par mois — comme l annonce la
 * page /confidentialite.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { CONSERVATION } from "../lib/conservation";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const A_BLANC = process.argv.includes("--a-blanc");

/** La date avant laquelle une ligne est echue, `mois` mois en arriere. */
function ilYaMois(mois: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - mois);
  return d;
}

/** Meme chose en jours. */
function ilYaJours(jours: number): Date {
  return new Date(Date.now() - jours * 24 * 60 * 60 * 1000);
}

// Une fonction, pas un `await` au niveau du module : tsx compile ce fichier
// en CommonJS (le package.json n a pas "type": "module"), ou l await de
// premier niveau est refuse avant meme la premiere ligne executee.
async function main() {
  const limiteConversations = ilYaMois(CONSERVATION.conversationsMois);
  const limiteLeads = ilYaMois(CONSERVATION.leadsMois);
  const limiteRateLimit = ilYaJours(CONSERVATION.rateLimitJours);

  // Une conversation sans demande, ou dont la demande n est pas cliente.
  // Ecrit en OR explicite : un NOT sur une relation nullable exclurait aussi,
  // selon la traduction SQL, les conversations SANS demande — c est-a-dire
  // precisement la majorite de celles qu il faut effacer.
  const whereConversations = {
    createdAt: { lt: limiteConversations },
    OR: [{ leadId: null }, { lead: { is: { status: { not: "WON" as const } } } }],
  };
  const whereLeads = {
    createdAt: { lt: limiteLeads },
    status: { not: "WON" as const },
  };
  const whereRateLimit = { createdAt: { lt: limiteRateLimit } };

  if (A_BLANC) {
    const [c, l, r] = await Promise.all([
      prisma.conversation.count({ where: whereConversations }),
      prisma.lead.count({ where: whereLeads }),
      prisma.rateLimit.count({ where: whereRateLimit }),
    ]);
    console.log(`A BLANC — rien n est efface.`);
    console.log(`  conversations echues : ${c} (avant ${limiteConversations.toISOString()})`);
    console.log(`  demandes echues      : ${l} (avant ${limiteLeads.toISOString()})`);
    console.log(`  journal anti-abus    : ${r} (avant ${limiteRateLimit.toISOString()})`);
    return;
  }

  const conversations = await prisma.conversation.deleteMany({ where: whereConversations });
  const leads = await prisma.lead.deleteMany({ where: whereLeads });
  const rateLimit = await prisma.rateLimit.deleteMany({ where: whereRateLimit });

  console.log(
    `Purge faite — conversations : ${conversations.count}, demandes : ${leads.count}, journal anti-abus : ${rateLimit.count}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
