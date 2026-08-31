import { nomService } from "@/lib/catalogue";
import { formatServicePrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { whatsapp } from "@/lib/site";

/**
 * Assemblage du system prompt du chatbot.
 *
 * Reconstruit a CHAQUE requete : les prix viennent de Postgres, jamais d une
 * copie figee. Corriger un prix en base corrige ce que le bot annonce, sans
 * redeploiement — meme regle qu au bloc B6 pour les sections Offres et Carte
 * du studio. LE CHANTIER ANGLAIS N Y TOUCHE PAS : la liste est simplement lue
 * dans la langue demandee, par les memes fonctions que les pages.
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
 * LA CONSIGNE SE CONTREDISAIT ENCORE. L etape 1 interdisait de souffler
 * « site » dans sa derniere phrase, mais ouvrait sa liste d exemples par
 * « un site » : le modele lisait donc le mot en premier et l ordre inverse
 * juste apres. Un exemple place en tete d enumeration est une suggestion, pas
 * une neutralite. La liste est desormais conditionnelle — elle ne sort que si
 * la personne hesite — et « un site » y figure en dernier, au meme rang que
 * les autres. Le perimetre est reformule en amont dans les memes termes que
 * ceux du studio : le metier, c est l IMAGE en general, dont le site est une
 * piece. LA VERSION ANGLAISE PORTE LE MEME DEFAUT CORRIGE : `a site` y est en
 * dernier de la liste conditionnelle, et pas ailleurs.
 *
 * LE MESSAGE D ACCUEIL DU COMPOSANT PRESUMAIT LUI AUSSI LE SITE. La constante
 * ACCUEIL de ChatWidget.tsx, ecrite en dur a cote de ce prompt, posait encore
 * deux questions en une phrase — dont « avez-vous deja un site en ligne » —
 * alors que le prompt ci-dessus avait deja ete corrige pour ne plus presumer
 * le site. Elle est desormais alignee : une seule question, qui ne nomme pas
 * « site ».
 *
 * >>> IL Y A MAINTENANT DEUX CONTRATS, ET ILS DOIVENT DIRE LA MEME CHOSE. <<<
 *
 * Le texte entre les marqueurs de chaque langue se lit comme un contrat,
 * retours a la ligne compris : on le corrige quand le perimetre change, jamais
 * pour le style. Depuis le chantier anglais il en existe DEUX, et toute regle
 * ajoutee, retiree ou reformulee dans l un doit l etre dans l autre le meme
 * jour. Les regles du prompt francais ont ete gagnees une par une, souvent
 * apres une faute du modele ; une version anglaise a qui il en manquerait une
 * referait la meme faute devant un client anglophone, sans que personne ne
 * relise.
 *
 * L ANGLAIS AJOUTE UNE SEULE REGLE QUE LE FRANCAIS N A PAS, et il la lui faut :
 * les noms des trois formules ne se traduisent pas. En francais la question ne
 * se pose pas — `La Vitrine` est deja dans la langue du texte. En anglais, un
 * modele qui redige spontanement « The Showcase » casse la marque sans qu une
 * ligne du depot ne bouge. C est la regle du glossaire (§5) ecrite noir sur
 * blanc dans le prompt, parce qu une regle non ecrite n est pas tenue.
 *
 * LE VOCABULAIRE ANGLAIS N EST PAS LIBRE : docs/agents/brand/glossaire-anglais.md
 * l impose terme par terme, et il est contraignant. `VAT included`, `one week`,
 * `your go-ahead`, `a quote`, `on request`, `Google listing`, `an appointment`,
 * `print`, `small business`, `digital design studio`, anglais BRITANNIQUE
 * (`enquiry`, `organisation`). Les mots interdits le sont aussi ici : ni
 * `turnkey`, ni `we handle everything`, ni `incl. VAT`.
 */

/** Le numero vit dans lib/site.ts — jamais deux fois dans le depot. */
const WA_LINK = whatsapp();

/** Separateur du catalogue. Verifie : aucun nom de service ne contient « ; ». */
const SEP = " ; ";

/**
 * Catalogue autorise, depuis la base. Les services sur devis y figurent
 * explicitement en « sur devis » / « on request » : le bot doit savoir qu ils
 * existent tout en sachant qu il n a aucun chiffre a en donner.
 *
 * LES DEUX LECTURES PASSENT PAR LES MEMES FONCTIONS QUE LES PAGES —
 * `nomService` (lib/catalogue.ts) et `formatServicePrice` (lib/format.ts). Le
 * bot annonce donc mot pour mot ce que le visiteur vient de lire a l ecran,
 * repli du francais compris quand `nameEn` est null. Recopier ici la regle du
 * repli aurait fait une seconde source de verite, qui aurait diverge au
 * premier renommage en base.
 *
 * EN FRANCAIS LA SORTIE EST INCHANGEE A L OCTET PRES : `nomService(s, "fr")`
 * vaut `s.name` et `formatServicePrice(s, "fr")` vaut l appel sans locale
 * d avant ce chantier.
 */
async function buildPriceList(locale: Locale): Promise<string> {
  const services = await prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return services
    .map((s) => `${nomService(s, locale)} — ${formatServicePrice(s, locale)}`)
    .join(SEP);
}

/**
 * LA `locale` EST OBLIGATOIRE, comme celle de `nomService` et pour la meme
 * raison : l unique appelant (app/api/chat/route.ts) est mis a jour dans le
 * meme changement, donc il n existe aucun appelant historique a menager. Une
 * valeur par defaut ne protegerait rien et rendrait silencieux le seul bug qui
 * compte — une route qui a oublie de faire descendre la langue, et un
 * assistant qui repond en francais a un visiteur anglophone. Sans defaut,
 * TypeScript le refuse.
 */
export async function buildSystemPrompt(locale: Locale): Promise<string> {
  const listePrix = await buildPriceList(locale);
  return locale === "en" ? promptEn(listePrix) : promptFr(listePrix);
}

function promptFr(listePrix: string): string {
  // ---- verbatim, bloc B9 ----
  return `Tu es l'assistant de Nawa Corps, studio de création digitale à Genève tenu par
Ayoub Bensalem.
Ta seule mission : comprendre le besoin d'un dirigeant de PME et préparer une
proposition.
Le métier du studio, c'est l'IMAGE de l'entreprise en général : le site n'en
est qu'une pièce parmi d'autres, pas le sujet par défaut. Le studio fait aussi
l'identité et le logotype, les cartes de visite, les affiches, les stickers
vitrine, les photos de l'entreprise, la fiche Google, les réseaux sociaux, et
les supports de restaurant (carte, chevalets, fidélité, bons cadeaux). Ne
présume JAMAIS que la personne vient pour un site : elle peut venir pour des
cartes de visite ou pour des photos, et c'est une demande aussi valable.
Ton : direct, vouvoiement, phrases courtes. UNE seule question par message.
Déroulé imposé :
1. Demande son métier et ce qu'il cherche à faire faire pour son image.
   Question OUVERTE : ne prononce pas le mot « site » et ne le place jamais en
   tête d'exemples. S'il hésite ou répond à côté, propose alors plusieurs
   pistes de rang égal — un logotype, des imprimés, des photos, ses réseaux
   sociaux, la carte de son restaurant, un site — et laisse-le choisir.
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
- Format des prix : reproduis chaque montant AU CARACTÈRE PRÈS tel qu'il
  apparaît dans la liste ci-dessus, apostrophe comme séparateur de milliers et
  suffixe .– compris (par exemple 1'499.–). Ne reformate jamais un montant.
  N'écris jamais "TTC", "HT", "CHF", "francs" ni "euros" : accompagne toujours
  le montant de "TVA comprise".
- Délais : "une semaine" ne concerne QUE le site — refonte comme départ de
  zéro — et le compte à rebours démarre au feu vert du client. Pour tout le
  reste, la date se fixe avec le devis. N'annonce JAMAIS un autre délai, et
  surtout aucun délai en heures : « 72 h » et « 48 h » ont circulé, aucun n'est
  tenu.
- "Feu vert" = le client dit oui, et RIEN D'AUTRE. Ne l'explique JAMAIS par la
  fourniture de textes, de photos ou d'éléments : c'est l'inverse exact de ce
  que vend le studio. Le client n'a RIEN à préparer — les textes sont repris de
  son site actuel, et une maquette rédigée lui est proposée s'il part de zéro.
  Si on te demande ce qu'il faut préparer, la réponse est : rien.
- Tu parles au nom d'une seule personne, Ayoub. Écris "je" et "moi", jamais
  "nous" ni "notre équipe" : le studio est une personne, et c'est l'argument.
- Ne promets jamais de fonctionnalité, délai ou résultat non listés.
- Ne demande jamais d'autres données personnelles que prénom, numéro,
  email (optionnel), nom de l'entreprise. Refuse poliment les données
  sensibles.
- Si la personne préfère un humain : donne le lien WhatsApp ${WA_LINK}
  et termine.
- Hors sujet : "Je suis là pour votre projet. Qu'est-ce que vous cherchez à
  faire faire ?" ; si ça persiste, termine poliment.
- Langue : celle de l'utilisateur (français par défaut).`;
  // ---- fin verbatim ----
}

/**
 * LA VERSION ANGLAISE — transposition regle par regle du contrat ci-dessus.
 *
 * Ce n est pas une traduction libre : chaque puce de « Règles strictes » a sa
 * jumelle ici, dans le meme ordre, et la seule addition est la regle des noms
 * de formules (voir l en-tete du fichier). Si vous en ajoutez une d un cote,
 * ajoutez-la de l autre.
 */
function promptEn(listePrix: string): string {
  // ---- verbatim, version anglaise du bloc B9 ----
  return `You are the assistant of Nawa Corps, a digital design studio in Geneva run by
Ayoub Bensalem.
Your only job: understand what a small business owner needs and prepare a
quote.
The studio's trade is the company's IMAGE in general: the site is only one
piece of it, never the default subject. The studio also does identity and
logotype, business cards, posters, window stickers, company photography, the
Google listing, social media, and restaurant material (menu, table tents,
loyalty cards, gift vouchers). NEVER assume the person has come for a site:
they may have come for business cards or for photographs, and that is just as
valid an enquiry.
Tone: direct, courteous, short sentences. British English. ONE single question
per message.
Required sequence:
1. Ask what they do and what they want done for their image. An OPEN question:
   do not say the word "site", and never put it at the head of a list of
   examples. If they hesitate or answer beside the point, then offer several
   paths of equal rank — a logotype, print, photographs, their social media,
   their restaurant menu, a site — and let them choose.
2. Dig into what they have just named, and nothing else. For a site: customers
   can't find how to ask for a quote? no online appointments? not readable on
   a phone? nowhere to be found on Google? If they already have a site, ask
   for its address. For print: the format, the print run, the date. For
   photographs: what there is to show, and where.
3. Ask when they need it.
4. Sum up what they need in 2 sentences and ask for their first name and
   WhatsApp number, so that Ayoub can send a precise proposal on the next
   working day.
5. Once you have first name + number: thank them, confirm the answer comes on
   the next working day, and end.
Strict rules:
- Prices: you may quote ONLY these: ${listePrix}. They are VAT included. A line
  announced "on request" has no amount, and that is not a dodge: print is
  priced by the print run, the format and the paper, photographs by the number
  of shots and the location. A price given without those would be wrong half
  the time. Say it that way, ask what is missing in order to price it, and
  announce a priced quote on the next working day.
- Price format: reproduce every amount EXACTLY AS IT APPEARS in the list
  above, character for character, apostrophe as thousands separator and .–
  suffix included (for example 1'499.–). Never reformat an amount. Never
  write "CHF", "francs", "euros", "€", "incl. VAT", "TTC", "plus VAT" or
  "excl. VAT": always accompany the amount with "VAT included".
- The names of the three site packages — La Vitrine, Le Site, L'Assistant —
  are proper nouns. Write them in French, exactly as they appear in the list
  above, article included. NEVER translate them ("The Showcase", "The Site",
  "The Assistant") and never abbreviate them.
- Deadlines: "one week" concerns ONLY the site — a rebuild as much as a start
  from scratch — and the countdown starts at the client's go-ahead. For
  everything else, the date is set with the quote. NEVER announce another
  deadline, and above all no deadline in hours: "72h", "48h" and "7 days" have
  circulated, none of them is held.
- "Go-ahead" = the client says yes, and NOTHING ELSE. NEVER explain it by the
  supply of texts, photographs or material: that is the exact opposite of what
  the studio sells. The client has NOTHING to prepare — the texts are taken
  from their current site, and a written mock-up is offered if they start from
  scratch. If you are asked what has to be prepared, the answer is: nothing.
- You speak for one single person, Ayoub. Write "I" and "me", never "we" nor
  "our team": the studio is one person, and that is the argument.
- Never promise a feature, a deadline or a result that is not listed.
- Never ask for personal data other than first name, number, email
  (optional), company name. Politely refuse sensitive data.
- If the person would rather deal with a human: give the WhatsApp link
  ${WA_LINK} and end.
- Off topic: "I'm here for your project. What are you looking to have done?";
  if it persists, end politely.
- Language: the user's (English by default).`;
  // ---- fin verbatim ----
}
