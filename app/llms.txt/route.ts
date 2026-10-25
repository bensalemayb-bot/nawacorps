import {
  lireMiseEnPlace,
  lirePaliers,
  phrasePaliers,
  texteOffreIntroduction,
} from "@/lib/catalogue";
import { dictionnaire } from "@/lib/dictionnaires";
import { mentionTva } from "@/lib/format";
import { lien } from "@/lib/i18n";
import { CHEMIN_DEMONSTRATIONS } from "@/lib/automatisations";
import { CHEMIN_GUIDES, GUIDES } from "@/lib/guides";
import { CHEMIN_METIERS, METIERS, cheminMetier } from "@/lib/metiers";
import { CONTACT, EXPLOITANT, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * /llms.txt — LE RESUME DU SITE POUR LES AGENTS D IA (format llmstxt.org).
 *
 * POURQUOI UNE ROUTE ET NON UN FICHIER DE public/ : les URL doivent etre
 * ABSOLUES et suivre le domaine de lib/site.ts (`SITE_URL`), et le montant de
 * la mise en place se lit en base comme partout (lib/catalogue.ts) — un
 * fichier statique l aurait fige, ce que CLAUDE.md interdit.
 *
 * CE QUI Y FIGURE vient de .agents/product-marketing.md, des pages et de
 * lib/metiers.ts (la liste des pages metiers, lue et non recopiee) : rien
 * qui n est pas deja affiche sur le site. Aucune reference client, aucun
 * nombre de clients — ni affirme, ni nie —, pas de delai. La grille de
 * l abonnement et l offre d introduction sont lues en base, comme sur
 * l accueil et /services. La promesse d hebergement en Suisse est bornee a
 * l assistant livre au client, comme sur les pages.
 *
 * LES « CHIFFRES CITES » sont ceux de (01) sur l accueil, lus dans le
 * dictionnaire (cle `chiffres`) et non recopies : chacun avec sa source et son
 * lien, et la phrase qui dit qu aucun n est un resultat du studio. La nuance
 * Humlum & Vestergaard (founder/research/chiffres-cles.md, G6) n est ecrite
 * qu ici : un agent qui cite les gains doit aussi lire qu ils sont plus
 * modestes en moyenne sur le terrain.
 *
 * LES GUIDES (25 octobre 2026) repondent aux questions que les gerants posent
 * aux moteurs (« combien coute… », « assistant ou secretaire… », nLPD) : ils
 * sont listes a part pour qu un agent trouve la page qui repond. /tarifs.md
 * (app/tarifs.md/route.ts) donne les prix lus en base, sans mise en page.
 * L adresse est celle de l EXPLOITANT (lib/site.ts), deja publiee dans les
 * mentions legales — lue, jamais recopiee.
 *
 * Le proxy (proxy.ts) ne passe pas sur ce chemin — son `matcher` exclut tout
 * chemin qui contient un point — et c est voulu : il n y a pas de `<html lang>`
 * a decider pour du texte brut.
 *
 * Rendu a la requete (handler GET dynamique par defaut depuis Next 15) : un
 * prix corrige depuis /admin s y lit aussitot. `lireMiseEnPlace` ne leve
 * jamais : sans base, la ligne se referme sans montant.
 */
export async function GET() {
  const [montant, paliers] = await Promise.all([lireMiseEnPlace(), lirePaliers("fr")]);
  const url = (chemin: string) => `${SITE_URL}${chemin}`;
  const en = (chemin: string) => url(lien("en", chemin));

  const prix = montant
    ? `Mise en place : ${montant}, ${mentionTva("fr")}, payée une fois, après l'essai, si le relevé convient.`
    : "Mise en place payée une fois, après l'essai, si le relevé convient.";
  const abonnement = paliers
    ? `Abonnement mensuel, trois paliers selon le volume : ${phrasePaliers(paliers, "fr")} ; ${mentionTva("fr")}. Sans engagement, résiliable chaque mois. Le palier se fixe par écrit à la fin de la démo.`
    : "Abonnement mensuel selon le volume, palier fixé par écrit à la fin de la démo, sans engagement, résiliable chaque mois.";
  const introduction = texteOffreIntroduction(paliers, "fr");
  const chiffres = dictionnaire("fr").chiffres;
  const lignesChiffres = chiffres.items
    .map((c) => `- ${c.valeur} ${c.texte} Source : [${c.source}](${c.url}) — ${c.perimetre}.`)
    .join("\n");

  // LES TITRES VIENNENT DU REGISTRE (lib/guides.ts), comme les pages : une
  // seule source, sinon llms.txt annonce un titre que la page ne porte pas.
  const lignesGuides = GUIDES.map(
    (g) => `- [${g.titre}](${url(`${CHEMIN_GUIDES}/${g.slug}`)}): ${g.resume}`,
  ).join("\n");

  const texte = `# ${SITE_NAME}

> Studio genevois qui installe dans les PME de Genève un assistant IA qui connaît déjà leur métier : il peut prendre les demandes (et, au palier Complet, les appels), préparer les devis et les relances, réclamer les pièces et proposer les rendez-vous, et ne s'engage jamais à la place du patron, qui valide tout.

Exploitant : ${EXPLOITANT.titulaire}, raison individuelle, ${EXPLOITANT.adresse}. Marché : Genève et Suisse romande. Clientèle : entreprises uniquement (B2B). Site en français, version anglaise sous /en.

## L'offre

- Cible : gérants de PME de services genevoises, tous métiers : artisans du bâtiment, régies, agences immobilières, fiduciaires, garages, architectes, salons, nettoyage, déménagement. Pas de cabinets médicaux, dentaires ou de physiothérapie, ni d'avocats (secret professionnel).
- Exemples de démonstration : chaque page métier montre une demande fictive, marquée comme telle.
- Démo : l'assistant montré sur des demandes types du métier du client, sans rien à préparer et sans accès à ses outils. Elle ne coûte rien.
- Essai : deux semaines, sur les vraies demandes du client ; un relevé chaque lundi. Il ne coûte rien.
- ${prix}
- ${abonnement}
${introduction ? `- ${introduction}\n` : ""}- Tarifs lisibles : [${url("/tarifs.md")}](${url("/tarifs.md")}), les prix en markdown, lus en base.
- Téléphone : la prise d'appels est incluse dans le palier Complet.
- Contrôle : aucun prix, aucune date, aucun devis, aucune réponse de fond ne part sans l'accord du client ; l'assistant propose les rendez-vous, le client les valide. Un seul message part seul : l'accusé de réception, relu et validé une fois. L'assistant n'a pas accès aux paiements.
- Données : les données de l'assistant livré au client sont hébergées en Suisse. Cette promesse ne vaut ni pour ce site ni pour Leo, l'assistant de démonstration du site.

## Chiffres cités

Sur l'accueil, section « ${chiffres.titreLigne1} ${chiffres.titreLigne2.replace(/\.$/, "")} ». Aucun n'est un résultat de ${SITE_NAME}.

${lignesChiffres}
- Nuance : sur le terrain, les gains moyens sont plus modestes (2,8 % du temps de travail au Danemark, [Humlum et Vestergaard, 2025](https://www.nber.org/papers/w33777)) ; ils grandissent quand l'usage est organisé.

${chiffres.cloture}

## Pages principales

- [Accueil](${url("/")}): l'assistant, le parcours démo → essai → abonnement, les questions fréquentes
- [L'assistant en détail](${url("/services")}): ce qu'il fait, comment se passe l'essai, ce que l'on paie
- [Les métiers](${url(CHEMIN_METIERS)}): une page par métier, avec ce que l'assistant peut faire et un exemple de démonstration
${METIERS.map((m) => `- [${m.fr.seoTitre}](${url(cheminMetier(m.slug))})`).join("\n")}
- [Démonstrations](${url(CHEMIN_DEMONSTRATIONS)}): deux exemples d'automatisation par métier, chacun avec son schéma (demandes fictives)
- [Demander une démo](${url("/devis")}): formulaire et assistant de conversation
- [Le studio](${url("/studio")}): qui fait le travail
- [Contact](${url("/contact")}): téléphone, WhatsApp, e-mail

## Guides

- [Les guides](${url("/guides")}): l'IA dans une PME genevoise, expliquée sans jargon
${lignesGuides}

## Informations légales

- [Mentions légales](${url("/mentions-legales")})
- [Confidentialité](${url("/confidentialite")})
- [Conditions générales de vente](${url("/cgv")})

## English

- [Home](${en("/")}): the assistant, the demo → trial → subscription steps, frequently asked questions
- [The assistant in detail](${en("/services")}): what it does, how the trial works, what you pay
- [Trades](${en(CHEMIN_METIERS)}): one page per trade, with what the assistant can do and a demo example
${METIERS.map((m) => `- [${m.en.seoTitre}](${en(cheminMetier(m.slug))})`).join("\n")}
- [Demos](${en(CHEMIN_DEMONSTRATIONS)}): two examples of automation per trade, each with its diagram (fictitious enquiries)
- [Get a demo](${en("/devis")}): form and conversation assistant
- [The studio](${en("/studio")}): who does the work
- [Contact](${en("/contact")}): phone, WhatsApp, email
- [Legal notice](${en("/mentions-legales")})
- [Privacy](${en("/confidentialite")})
- [Terms and conditions](${en("/cgv")})

## Contact

- E-mail : ${CONTACT.email}
- Téléphone : ${CONTACT.telephoneAffiche}
- Adresse : ${EXPLOITANT.adresse}
`;

  return new Response(texte, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
