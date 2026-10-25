import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { estBrouillon, robotsSiBrouillon } from "@/lib/brouillon";
import { CONSERVATION } from "@/lib/conservation";
import { CONTACT, EXPLOITANT, alternatesPage, openGraphPage, whatsappHref } from "@/lib/site";

/**
 * Confidentialite (nLPD, compatible RGPD).
 *
 * Meme ossature que /mentions-legales : statique, zero CSS et zero classe
 * nouvelle, aucun [data-reveal] ecrit a la main, aucun <h3> nu. Voir le
 * docblock de app/(site)/mentions-legales/page.tsx pour le detail des deux
 * garde-fous.
 *
 * REECRITE LE 25 OCTOBRE 2026 A PARTIR DU CODE, traitement par traitement.
 * L ancienne version annoncait « nom, telephone, message » et « 12 mois »
 * sans dire que la conversation de Leo est enregistree meme si le visiteur
 * quitte la page (sendBeacon, components/ChatWidget.tsx), ni qu une IA en
 * extrait des coordonnees et une note (app/api/chat/finalize/route.ts), ni
 * que Telegram recoit les demandes, ni qu une empreinte d IP est journalisee
 * (lib/iphash.ts). Chaque rubrique ci-dessous correspond a un chemin reel du
 * code ; un traitement ajoute au code s ajoute ici, et a la jumelle anglaise.
 *
 * LES DUREES VIENNENT DE lib/conservation.ts, que scripts/purger-donnees.ts
 * applique : la promesse et la purge ne peuvent pas diverger.
 *
 * LES MARQUEURS DE VERIFICATION SONT TOUS PARTIS LE 25 OCTOBRE 2026, chacun
 * par une verification et non par une formule rassurante :
 *  - certifications Swiss-U.S. DPF : Vercel Inc., Google LLC et Databricks,
 *    Inc. (qui couvre Neon, LLC) sont actifs sur la liste officielle
 *    dataprivacyframework.gov/list ; Groq n y figure pas, d ou les clauses
 *    types de son avenant (console.groq.com/docs/legal) ;
 *  - Neon : region eu-central-1 (Francfort), lue dans la chaine de connexion ;
 *  - Leo repond par Groq (LLM_PROVIDER, lib/llm.ts) ; Gemini n est qu un
 *    repli de code, sans cle configuree — d ou « si elle est activee » ;
 *  - Telegram : contractant Telegram Messenger Inc. (telegram.org/tos/
 *    bot-developers), groupe aux iles Vierges britanniques et a Dubai
 *    (telegram.org/privacy, § 8.2), aucun des deux a l annexe 1 OPDo : la
 *    communication repose sur l art. 17 al. 1 let. b nLPD ;
 *  - journaux Vercel : 1 heure a 30 jours selon la formule
 *    (vercel.com/docs/logs/runtime#limits) ; le reste « selon ses propres
 *    regles », faute de duree publiee.
 * La purge des notifications Telegram reste MANUELLE (scripts/
 * purger-donnees.ts ne sort pas de la base) : la page le dit. Si un fait
 * change — fournisseur d IA, region, certification —, ces lignes, la page et
 * sa jumelle anglaise changent ensemble.
 */
const DESCRIPTION =
  "Confidentialité de Nawa Corps (nLPD) : formulaire, Leo, notifications, destinataires, durées de conservation et vos droits.";

/**
 * GARDE-FOU DE BROUILLON (lib/brouillon.ts) : calcule sur le corps meme de la
 * page, adresse de lib/site.ts comprise. Depuis le 25 octobre 2026 la page ne
 * porte plus aucun marqueur : elle est indexee et figure au sitemap. Le calcul
 * reste en place — un marqueur reecrit un jour la remettrait seul en
 * `noindex, follow` et la sortirait de app/sitemap.ts.
 */
export const BROUILLON = estBrouillon(corps());

export const metadata: Metadata = {
  ...robotsSiBrouillon(BROUILLON),
  title: "Confidentialité",
  description: DESCRIPTION,
  alternates: alternatesPage("/confidentialite"),
  openGraph: openGraphPage({
    titre: "Confidentialité — Nawa Corps",
    description: DESCRIPTION,
    chemin: "/confidentialite",
  }),
};

function corps() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      {/* Fil d Ariane : la page est un cul-de-sac de navigation, le moteur a
          besoin qu on lui dise d ou elle depend. */}
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Confidentialité", chemin: "/confidentialite" },
        ]}
      />
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Nawa Corps · nLPD</span>
        </div>
        <h1 className="t">Confidentialité</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p>Mise à jour : 25 octobre 2026.</p>

          <p className="meta">Responsable du traitement</p>
          <p>{EXPLOITANT.titulaire}, {EXPLOITANT.nomCommercial} (raison individuelle), {EXPLOITANT.adresse}. Contact pour toute question sur vos données : <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>

          <p className="meta">Cadre</p>
          <p>Ce site applique la loi fédérale sur la protection des données (nLPD) et son ordonnance (OPDo). Pour les visiteurs situés dans l&apos;Union européenne, notamment en France voisine, le règlement général sur la protection des données (RGPD) s&apos;applique lorsque ses conditions sont réunies.</p>
          <p>La nLPD n&apos;exige pas de base légale pour un traitement qui respecte ses principes ; nous indiquons tout de même pourquoi chaque traitement a lieu. Au sens du RGPD (art. 6), ce sont des mesures précontractuelles prises à votre demande (let. b) ou notre intérêt légitime à répondre aux demandes et à protéger le site (let. f). Aucun traitement ne repose sur votre consentement, et aucun ne sert à la publicité.</p>

          <p className="meta">1. Le formulaire de démo</p>
          <p>Données : votre nom (obligatoire), votre téléphone ou votre e-mail (l&apos;un des deux obligatoire), votre message, et la page d&apos;où part la demande.</p>
          <p>Finalité : vous répondre, organiser la démo et préparer une offre écrite. Base : mesures précontractuelles.</p>
          <p>La demande est enregistrée dans notre base de données. Une notification part aussitôt sur la messagerie Telegram de l&apos;exploitant : votre nom, votre téléphone, votre e-mail et les 200 premiers caractères du message.</p>

          <p className="meta">2. Leo, l&apos;assistant de conversation</p>
          <p>Données : ce que vous écrivez à Leo. À chaque message, la conversation en cours est transmise à un fournisseur d&apos;intelligence artificielle aux États-Unis (voir « Destinataires ») pour produire la réponse.</p>
          <p>Enregistrement : la conversation est enregistrée dans notre base quand vous cliquez « Demander ma démo », et aussi automatiquement quand vous quittez ou fermez la page après quelques échanges. Elle est alors envoyée une seconde fois au fournisseur d&apos;IA, qui en extrait votre nom, votre téléphone, votre e-mail, votre métier, le nom de votre entreprise, votre besoin, son urgence et une note d&apos;intérêt de 1 à 5. Si un nom et un téléphone y figurent, une fiche de demande est créée, et une notification Telegram en reprend l&apos;essentiel.</p>
          <p>Aucune décision n&apos;est prise de façon automatisée : la note sert seulement à trier les demandes. Chaque demande est lue par l&apos;exploitant, qui décide seul de la suite.</p>
          <p>Finalité : répondre à votre demande de démo. Base : mesures précontractuelles et intérêt légitime. Ne confiez à Leo aucune information sensible (santé, données de vos clients) : écrivez-nous directement.</p>

          <p className="meta">3. Les notifications Telegram</p>
          <p>Elles permettent à l&apos;exploitant, seul et sans bureau, de voir une demande pendant la journée. Elles contiennent les données indiquées aux points 1 et 2. Le service est fourni par Telegram Messenger Inc., établie hors de Suisse et de l&apos;Union européenne ; selon sa politique de confidentialité, les données peuvent aussi être partagées avec les sociétés de son groupe aux îles Vierges britanniques et à Dubaï. Ces pays ne figurent pas sur la liste des États dont la Suisse reconnaît la protection comme adéquate : la communication repose sur l&apos;art. 17 al. 1 let. b nLPD, parce qu&apos;elle est en relation directe avec la conclusion du contrat que votre demande prépare (pour les visiteurs de l&apos;Union européenne : RGPD art. 49 § 1 let. b).</p>
          <p>Telegram garde les messages jusqu&apos;à leur suppression. La purge automatique de notre base ne les atteint pas : l&apos;exploitant supprime lui-même les notifications de la messagerie, dans les mêmes délais que la base.</p>

          <p className="meta">4. Le journal anti-abus</p>
          <p>À chaque envoi du formulaire, message à Leo ou enregistrement de conversation, nous enregistrons une empreinte de votre adresse IP (hachage SHA-256 avec un sel secret : l&apos;adresse elle-même n&apos;est pas conservée), le type d&apos;action et l&apos;heure. Cette empreinte figure aussi sur la conversation enregistrée. Finalité : limiter les envois en masse et les abus. Base : intérêt légitime à la sécurité du site.</p>

          <p className="meta">5. Journaux techniques de l&apos;hébergeur</p>
          <p>Comme tout serveur, l&apos;hébergeur Vercel traite votre adresse IP, la page demandée et l&apos;heure pour acheminer et sécuriser le site. Les journaux que l&apos;exploitant peut consulter sont conservés par Vercel d&apos;une heure à 30 jours selon la formule d&apos;hébergement ; Vercel garde ses autres journaux techniques selon ses propres règles de conservation.</p>

          {/* L ancre #cookies est la cible du lien « Cookies » du pied de page
              et du bandeau (components/BandeauCookies.tsx). Cette rubrique
              liste TOUT ce que le site range dans le navigateur : une cle
              ajoutee au code s ajoute ici, et a la jumelle anglaise. */}
          <p className="meta" id="cookies">6. Cookies et stockage dans le navigateur</p>
          <p>Aucun outil de mesure d&apos;audience, aucun pixel publicitaire, aucun traceur tiers. En temps normal, le site ne dépose aucun cookie chez les visiteurs. Les polices sont servies par notre propre site : votre navigateur n&apos;interroge pas Google Fonts.</p>
          <p>Le site range deux valeurs dans votre navigateur. Aucune ne contient de donnée personnelle, et aucune n&apos;est envoyée à notre serveur :</p>
          <p>— « bnc-intro », dans le stockage de session : évite de rejouer l&apos;animation d&apos;ouverture à chaque page. Elle s&apos;efface à la fermeture de l&apos;onglet.</p>
          <p>— « nawa-cookies », dans le stockage local : retient que vous avez fermé le bandeau d&apos;information sur les cookies, pour qu&apos;il ne revienne pas à chaque visite. Elle reste jusqu&apos;à ce que vous effaciez les données du site dans votre navigateur.</p>
          <p>Si le pare-feu de l&apos;hébergeur soumet votre navigateur à une vérification anti-robots, Vercel y enregistre une session de vérification valable une heure. Un cookie technique (« admin_session », valable 24 heures) existe enfin pour l&apos;administrateur seul, quand il se connecte à l&apos;espace de gestion.</p>
          <p>Tout cela est nécessaire au fonctionnement du site et ne demande donc pas votre accord. Si un outil de mesure d&apos;audience était un jour ajouté, vous pourriez l&apos;accepter ou le refuser, et cette page le dirait.</p>

          <p className="meta">Destinataires et pays</p>
          <p>Vos données ne sont ni vendues ni louées. Elles sont confiées aux sous-traitants suivants, pour les seules finalités ci-dessus :</p>
          <p>— Vercel Inc. (États-Unis) : hébergement du site, serveurs à Francfort (Allemagne).</p>
          <p>— Neon, LLC (États-Unis, groupe Databricks) : base de données, serveurs à Francfort (Allemagne).</p>
          <p>— Groq, Inc. (États-Unis) : modèle d&apos;IA qui fait répondre Leo. Par défaut, Groq ne conserve pas les requêtes ; il peut en garder le contenu jusqu&apos;à 30 jours pour diagnostiquer une panne ou enquêter sur un abus.</p>
          <p>— Google LLC (États-Unis) : modèle d&apos;IA Gemini, solution de remplacement utilisée seulement si elle est activée à la place de Groq. Pour un service proposé en Suisse, les conditions de Google excluent l&apos;usage des contenus pour améliorer ses produits ; ils sont journalisés pour une durée limitée, afin de détecter les abus.</p>
          <p>— Telegram Messenger Inc. : notifications (point 3).</p>
          <p>L&apos;Allemagne figure sur la liste des États dont le Conseil fédéral reconnaît une protection adéquate (annexe 1 OPDo). Pour les États-Unis, la même annexe reconnaît les entreprises certifiées selon le Swiss-U.S. Data Privacy Framework : Vercel Inc., Google LLC et Databricks, Inc. (dont Neon, LLC) le sont, d&apos;après la liste officielle (dataprivacyframework.gov) consultée le 25 octobre 2026. Groq n&apos;y figure pas : la communication repose sur les clauses contractuelles types de l&apos;Union européenne, adaptées au droit suisse, que prévoit son avenant sur le traitement des données. Pour Telegram, voir le point 3. Pour les visiteurs de l&apos;Union européenne, les garanties équivalentes du RGPD s&apos;appliquent (décision d&apos;adéquation UE–États-Unis pour les entreprises certifiées, clauses contractuelles types pour Groq).</p>
          <p>Si vous nous écrivez sur <a className="lnk" href={whatsappHref("fr")} target="_blank" rel="noopener">WhatsApp</a>, vos messages passent par WhatsApp (Meta), selon ses propres règles.</p>

          <p className="meta">Durée de conservation</p>
          <p>Demandes (formulaire et Leo) : {CONSERVATION.leadsMois} mois après leur réception. Conversations avec Leo : {CONSERVATION.conversationsMois} mois. Journal anti-abus : {CONSERVATION.rateLimitJours} jours. Si une demande aboutit à un contrat, les données utiles au contrat sont conservées pendant sa durée, puis pendant les délais légaux (dix ans pour les pièces comptables, art. 958f CO).</p>
          <p>Un script de purge efface automatiquement de la base tout ce qui a dépassé ces durées. Il est lancé régulièrement, au moins une fois par mois.</p>

          <p className="meta">Sécurité</p>
          <p>Le site est servi en HTTPS. Les adresses IP ne sont pas stockées en clair. L&apos;espace de gestion est protégé par un mot de passe et n&apos;est accessible qu&apos;à l&apos;exploitant.</p>

          <p className="meta">Vos droits</p>
          <p>Vous pouvez demander l&apos;accès à vos données, leur rectification, leur effacement, la limitation du traitement, vous opposer à un traitement, et obtenir la remise ou la transmission de vos données dans un format courant (nLPD art. 25, 28 et 32 ; RGPD art. 15 à 21). Écrivez à <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Nous répondons dans les 30 jours et pouvons vous demander de prouver votre identité.</p>

          <p className="meta">Réclamation</p>
          <p>Vous pouvez saisir le Préposé fédéral à la protection des données et à la transparence (PFPDT), Feldeggweg 1, 3003 Berne, edoeb.admin.ch. Si vous résidez dans l&apos;Union européenne, vous pouvez aussi saisir l&apos;autorité de votre pays — en France, la CNIL (cnil.fr).</p>

          <p className="meta">Modifications</p>
          <p>Cette page suit le fonctionnement réel du site. Elle est mise à jour quand un traitement change ; la date en tête fait foi.</p>

          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
    </>
  );
}

export default function Confidentialite() {
  return corps();
}
