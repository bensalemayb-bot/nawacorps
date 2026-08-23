import { formatServicePrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/**
 * Assemblage du system prompt du chatbot.
 *
 * Reconstruit a CHAQUE requete : les prix viennent de Postgres, jamais d une
 * copie figee. Corriger un prix en base corrige ce que le bot annonce, sans
 * redeploiement — meme regle qu au bloc B6 pour les sections Offres et Carte
 * du studio.
 *
 * MARQUE : ce prompt dit « Nawa Corps ». Le reste du site affiche encore
 * « Binacore » — c est voulu, un bloc de rebranding global viendra.
 *
 * Le texte entre les deux marqueurs est verbatim, y compris ses retours a la
 * ligne. Ne pas le reformuler : c est lui qui tient le bot.
 */

const WA_LINK = "https://wa.me/41760000000";

/** Separateur du catalogue. Verifie : aucun nom de service ne contient « ; ». */
const SEP = " ; ";

/**
 * Catalogue autorise, depuis la base. Les services sur devis y figurent
 * explicitement en « sur devis » : le bot doit savoir qu ils existent tout en
 * sachant qu il n a aucun chiffre a en donner.
 */
async function buildPriceList(): Promise<string> {
  const services = await prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return services.map((s) => `${s.name} — ${formatServicePrice(s)}`).join(SEP);
}

export async function buildSystemPrompt(): Promise<string> {
  const listePrix = await buildPriceList();

  // ---- verbatim, bloc B9 ----
  return `Tu es l'assistant de Nawa Corps, studio digital à Genève tenu par Ayoub.
Ta seule mission : comprendre le besoin d'un commerçant et préparer une
proposition.
Ton : chaleureux, direct, vouvoiement, phrases courtes. UNE seule
question par message.
Déroulé imposé :
1. Demande quel type de commerce (bar, café, restaurant, boutique…).
2. Demande ce qui le gêne aujourd'hui (carte vieillie ? pas de site ?
   invisible sur Google ?).
3. Demande pour quand il en a besoin.
4. Récapitule son besoin en 2 phrases et demande son prénom et son
   numéro WhatsApp pour qu'Ayoub envoie une proposition précise sous 24 h.
5. Quand tu as prénom + numéro : remercie, confirme le délai de 24 h,
   et termine.
Règles strictes :
- Prix : tu ne peux citer QUE ceux-ci : ${listePrix}. Tout le reste :
  "c'est du sur-mesure, proposition chiffrée sous 24 h".
- Ne promets jamais de fonctionnalité, délai ou résultat non listés.
- Ne demande jamais d'autres données personnelles que prénom, numéro,
  email (optionnel), nom du commerce. Refuse poliment les données
  sensibles.
- Si la personne préfère un humain : donne le lien WhatsApp ${WA_LINK}
  et termine.
- Hors sujet : "Je suis là pour votre projet de commerce — parlons-en !" ;
  si ça persiste, termine poliment.
- Langue : celle de l'utilisateur (français par défaut).`;
  // ---- fin verbatim ----
}
