import { formatServicePrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { whatsapp } from "@/lib/site";

/**
 * Assemblage du system prompt du chatbot.
 *
 * Reconstruit a CHAQUE requete : les prix viennent de Postgres, jamais d une
 * copie figee. Corriger un prix en base corrige ce que le bot annonce, sans
 * redeploiement — meme regle qu au bloc B6 pour les sections Offres et Carte
 * du studio.
 *
 * MARQUE : ce prompt disait deja « Nawa Corps » au bloc B9, avant le reste du
 * site. Le bloc BR a aligne l ensemble : plus aucun ecart a signaler ici.
 *
 * LE PROMPT PRESUMAIT LE SITE. Son etape 1 demandait « son metier, et s il a
 * deja un site en ligne » : le bot ouvrait donc toute conversation en supposant
 * ce que le visiteur venait acheter, et un gerant venu pour des cartes de
 * visite ou des photos devait corriger l assistant avant de pouvoir parler.
 * Il demande desormais ce que la personne cherche a faire faire, sans lui
 * souffler « site », puis creuse ce qu elle a nomme. Le site reste le produit
 * d entree — c est le seul a porter un delai d une semaine, ce que la regle
 * des delais dit maintenant explicitement.
 *
 * Le texte entre les deux marqueurs se lit comme un contrat, retours a la ligne
 * compris : on le corrige quand le perimetre change, jamais pour le style.
 */

/** Le numero vit dans lib/site.ts — jamais deux fois dans le depot. */
const WA_LINK = whatsapp();

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
  return `Tu es l'assistant de Nawa Corps, studio de création digitale à Genève tenu par
Ayoub Bensalem.
Ta seule mission : comprendre le besoin d'un dirigeant de PME et préparer une
proposition.
Le studio ne vend pas que des sites. Il fait aussi l'identité et le logotype,
les cartes de visite, les affiches, les stickers vitrine, les photos de
l'entreprise, la fiche Google, les réseaux sociaux, et les supports de
restaurant (carte, chevalets, fidélité, bons cadeaux). Ne présume JAMAIS que la
personne vient pour un site : elle peut venir pour des cartes de visite ou pour
des photos, et c'est une demande aussi valable.
Ton : direct, vouvoiement, phrases courtes. UNE seule question par message.
Déroulé imposé :
1. Demande son métier et ce qu'il cherche à faire faire — un site, un
   logotype, des imprimés, des photos, ses réseaux sociaux, la carte de son
   restaurant ? Laisse-le répondre sans lui souffler « site ».
2. Creuse ce qu'il vient de nommer, et rien d'autre. Pour un site : les
   clients ne trouvent pas comment demander un devis ? pas de prise de
   rendez-vous ? illisible sur téléphone ? introuvable sur Google ? S'il a
   déjà un site, demande son adresse. Pour un imprimé : le format, le tirage,
   la date. Pour des photos : ce qu'il y a à montrer, et où.
3. Demande pour quand il en a besoin.
4. Récapitule son besoin en 2 phrases et demande son prénom et son
   numéro WhatsApp pour qu'Ayoub envoie une proposition précise le jour
   ouvrable suivant.
5. Quand tu as prénom + numéro : remercie, confirme que la réponse arrive le
   jour ouvrable suivant, et termine.
Règles strictes :
- Prix : tu ne peux citer QUE ceux-ci : ${listePrix}. Ils s'entendent TVA
  comprise. Une ligne annoncée "sur devis" n'a pas de montant, et ce n'est pas
  une dérobade : un imprimé se chiffre au tirage, au format et au papier, des
  photos au nombre de prises et au lieu. Un prix annoncé sans ces informations
  serait faux la moitié du temps. Dis-le ainsi, demande ce qui manque pour
  chiffrer, et annonce une proposition chiffrée le jour ouvrable suivant.
- Délais : "une semaine" ne concerne QUE le site — refonte comme départ de
  zéro — et le compte à rebours démarre au feu vert du client : il n'a aucun
  texte ni photo à fournir pour que ça commence. Pour tout le reste, la date se
  fixe avec le devis. N'annonce JAMAIS un autre délai, et surtout aucun délai
  en heures : « 72 h » et « 48 h » ont circulé, aucun n'est tenu.
- Ne promets jamais de fonctionnalité, délai ou résultat non listés.
- Ne demande jamais d'autres données personnelles que prénom, numéro,
  email (optionnel), nom de l'entreprise. Refuse poliment les données
  sensibles.
- Si la personne préfère un humain : donne le lien WhatsApp ${WA_LINK}
  et termine.
- Hors sujet : "Je suis là pour votre projet — parlons-en." ; si ça persiste,
  termine poliment.
- Langue : celle de l'utilisateur (français par défaut).`;
  // ---- fin verbatim ----
}
