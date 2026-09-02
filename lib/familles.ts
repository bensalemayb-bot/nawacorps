import type { Metadata } from "next";
import { TVA_LABEL, mentionTva } from "@/lib/format";
import { LOCALE_DEFAUT, type Locale } from "@/lib/i18n";
import { SITE_NAME, alternatesPage, openGraphPage, whatsapp } from "@/lib/site";

/**
 * LES CINQ FAMILLES DE PRESTATIONS — la matiere editoriale des pages
 * /services/<famille>.
 *
 * POURQUOI DES FAMILLES ET PAS UNE PAGE PAR LIGNE. Le meme raisonnement que
 * lib/formules.ts, applique au reste du catalogue : treize lignes en base
 * n ont chacune qu un nom, une description d une ligne et un prix. Treize
 * pages baties la-dessus seraient du contenu mince, et le contenu mince
 * dessert le referencement au lieu de le servir. Regroupees par famille, les
 * memes lignes ont de la matiere : ce qu elles resolvent, ce qu elles
 * produisent, ce qu elles ne couvrent pas, et pourquoi elles se chiffrent sur
 * devis.
 *
 * CE QUI N EST PAS ICI : ni nom, ni description, ni prix. Ils viennent de
 * Postgres (table Service), comme partout ailleurs sur le site. Ce fichier ne
 * connait que des SLUGS. Corriger un prix en base le corrige sur ces pages
 * aussi, et AUCUN montant n est ecrit ici — ni a l ecran, ni dans une reponse
 * de FAQ, ni dans la donnee structuree. C est la raison pour laquelle les
 * questions de la famille « Suivi » renvoient au « prix affiche ci-dessus »
 * plutot que de le repeter : un chiffre recopie dans une phrase est un chiffre
 * qui devient faux le jour ou la base change.
 *
 * LE DELAI. « une semaine » n apparait qu UNE fois sur ces cinq pages — dans
 * la FAQ des imprimes — et il y voyage accompagne de son point de depart
 * (« des votre feu vert »), comme l exige le guide de voix §5. Il n est PAS
 * etendu a un logotype, a une seance photo ou a une carte de restaurant : le
 * positionnement ne porte ce delai que sur le site, et l etendre serait un
 * engagement que personne n a pris.
 *
 * AUCUNE COMPARAISON, AUCUN SUPERLATIF, AUCUNE REFERENCE CLIENT. Le studio a
 * un client et zero reference de site (.agents/product-marketing.md §9) ; les
 * vignettes de ces pages sont des DEMONSTRATIONS, etiquetees comme telles a
 * cote de la piece — voir components/VignettePrestation.tsx.
 *
 * ---------------------------------------------------------------------------
 * LA VERSION ANGLAISE — le motif `En`, et la regle du repli.
 *
 * Chaque champ editorial a un jumeau OPTIONNEL suffixe `En` : `quoi` /
 * `quoiEn`, `produit` / `produitEn`, `q` / `qEn`. C est le meme motif que la
 * table Service, dont les colonnes s appellent `nameEn` et `descriptionEn`
 * (prisma/seed.ts) — un seul motif pour tout le site, sinon chaque fichier
 * invente le sien et plus personne ne sait ou chercher une traduction.
 *
 * ILS SONT OPTIONNELS VOLONTAIREMENT, et ce n est pas de la paresse de typage.
 * Un champ obligatoire forcerait a traduire tout ou rien, et la moitie du
 * travail partirait en chaines vides : le lecteur anglophone verrait des trous.
 * Optionnel, l absence de traduction fait RETOMBER SUR LE FRANCAIS — une page
 * qui se lit en entier dans une langue melangee vaut mieux qu une page trouee.
 * Le repli se decide chez le CONSOMMATEUR (`piece.quoiEn ?? piece.quoi`), pas
 * ici : ce fichier ne porte que de la matiere.
 *
 * CE QUI N EST PAS TRADUIT ICI, ET NE DOIT PAS L ETRE : les `slug`, les `href`,
 * les ancres et les `sujet` (`devis-identite`…). Un slug traduit casserait les
 * URL publiques et les seize ancres que le catalogue pointe
 * (lib/catalogue-familles.ts, `hrefService`). Les NOMS des trois formules ne se
 * traduisent pas non plus — `La Vitrine`, `Le Site`, `L Assistant`, article
 * compris —, raison pour laquelle les pages ci-dessous les designent par
 * periphrase (« the package that carries the assistant ») exactement comme le
 * francais le fait deja.
 *
 * LE VOCABULAIRE ANGLAIS EST FIXE AILLEURS : docs/agents/brand/glossaire-anglais.md.
 * Il est contraignant, et il tranche deja ce domaine — `table tents`,
 * `gift vouchers`, `loyalty card`, `poster`, `shopfront sign`, `print`,
 * `upkeep`, `hosting`, `an enquiry`, `a quote`. Les
 * NOMS de prestation, eux, sont repris MOT POUR MOT des `nameEn` de
 * prisma/seed.ts : la page d une famille ne peut pas appeler une ligne
 * autrement que la carte qui l affiche deux ecrans plus haut.
 *
 * TROIS REGLES QUI NE BOUGENT PAS EN ANGLAIS. Le studio parle a la PREMIERE
 * PERSONNE DU PLURIEL depuis le 31 aout 2026 : `we`, `us`, `our`, JAMAIS `I`
 * ni `my`. La regle precedente disait l inverse ; le proprietaire l a renversee.
 * Le pluriel ne decrit rien de plus que le singulier ne decrivait — jamais
 * `our team of X`, `our offices`, `our designers`, `since 20XX` : la LCD art. 3
 * vise les indications trompeuses, et elle ne s arrete pas a la frontiere de la
 * langue. L anglais est BRITANNIQUE : `enquiry`, `organisation`, `colour`. Et
 * le delai reste « one week », jamais un compte d heures, jamais seul : la
 * seule occurrence de ce fichier porte son point de depart
 * (« from your go-ahead »).
 */

/**
 * Les cinq segments statiques, dans l ordre ou ils apparaissent au catalogue.
 *
 * Ce sont des SEGMENTS STATIQUES sous app/(site)/services/ : ils l emportent
 * sur le voisin [slug], qui ne connait que les trois formules de site. Aucun
 * conflit de route, et aucun de ces cinq mots ne peut donc devenir un slug de
 * formule un jour sans que la page statique gagne — d ou la liste ci-dessous,
 * qui sert aussi de garde-fou a la relecture.
 */
export const FAMILLE_SLUGS = [
  "site-web",
  "imprimes",
  "identite",
] as const;

export type FamilleSlug = (typeof FAMILLE_SLUGS)[number];

/**
 * Une prestation de la famille.
 *
 * `slug` est la cle de lecture en base : le NOM, la DESCRIPTION et le PRIX
 * affiches viennent de la ligne Service correspondante, jamais d ici.
 */
export type Piece = {
  /** Slug de la table Service. */
  slug: string;
  /** Ce que c est concretement, dans les mots du client. */
  quoi: string;
  /** Idem en anglais. Absent = la page retombe sur `quoi`. */
  quoiEn?: string;
  /** Ce que la prestation produit — ce que le client a en main a la fin. */
  produit: readonly string[];
  /**
   * Idem en anglais. Absent = la page retombe sur `produit`.
   *
   * LA LISTE SE TRADUIT EN BLOC, jamais ligne a ligne : deux listes de
   * longueurs differentes n ont aucun moyen de se correspondre, et une puce
   * anglaise glissee au milieu de quatre puces francaises est pire qu une
   * liste entierement francaise.
   */
  produitEn?: readonly string[];
  /**
   * Pourquoi cette ligne se chiffre sur devis. RENDU UNIQUEMENT si la base
   * annonce effectivement « sur devis » : le jour ou un prix ferme est pose en
   * base, l explication disparait d elle-meme au lieu de contredire le montant
   * juste au-dessus.
   */
  raisonDevis?: string;
  /** Idem en anglais. Absent = la page retombe sur `raisonDevis`. */
  raisonDevisEn?: string;
  /**
   * Formules de site dont cette ligne decoule. Les NOMS sont lus en base, pas
   * ecrits ici. Sert au bloc « Le suivi decoule du palier achete » du
   * positionnement §5 : le suivi n est pas un menu, il suit le site.
   *
   * PAS DE JUMEAU `En` : ce sont des SLUGS, et les noms des trois formules ne
   * se traduisent pas.
   */
  suitFormules?: readonly string[];
  /**
   * Presente = la ligne est OBLIGATOIRE avec les formules liees, et la chaine
   * dit pourquoi. Un prix mensuel impose qui ne serait pas annonce est un prix
   * cache (guide de voix §8, interdit n°4).
   */
  obligatoire?: string;
  /** Idem en anglais. Absent = la page retombe sur `obligatoire`. */
  obligatoireEn?: string;
};

/**
 * Une ligne du bloc « ce qui n est pas compris ».
 *
 * `ou` est TOUJOURS rendu : en lien quand `href` est renseigne, en simple
 * mention sinon. Une ligne qui dirait seulement ce qu on ne fait pas laisse le
 * lecteur sans suite ; celle-ci dit ou aller, ou qu il n y a nulle part ou
 * aller — ce qui est encore une reponse.
 */
export type HorsPerimetre = {
  /** Ce qui n est pas couvert. */
  quoi: string;
  /** Idem en anglais. Absent = la ligne retombe sur `quoi`. */
  quoiEn?: string;
  /**
   * Ou ca se trouve. `null` = ca n est pas au catalogue du tout.
   *
   * PAS DE JUMEAU `En` : c est une URL, et les URL ne se traduisent pas.
   */
  href: string | null;
  /** Libelle du lien, ou mention rendue telle quelle si `href` vaut null. */
  ou: string;
  /** Idem en anglais. Absent = la ligne retombe sur `ou`. */
  ouEn?: string;
};

type Question = { q: string; r: string; qEn?: string; rEn?: string };

type Famille = {
  /** Le h1, en deux lignes. La seconde contient toujours « Genève ». */
  h1: readonly [string, string];
  /**
   * Idem en anglais. La seconde ligne contient toujours « Geneva » — le marche
   * ne change pas avec la langue, et il ne devient jamais « Switzerland ».
   */
  h1En?: readonly [string, string];
  /** Libelle de la famille, pour le fil et la donnee structuree. */
  libelle: string;
  /** Idem en anglais. Sert aussi a la nav (lib/catalogue-familles.ts). */
  libelleEn?: string;
  /** `title` de la page. Sous 60 caracteres, avec « Genève ». */
  seoTitre: string;
  /** Idem en anglais, meme contrainte de longueur, avec « Geneva ». */
  seoTitreEn?: string;
  /** `description` de la page. Sous 155 caracteres. */
  seoDescription: string;
  /** Idem en anglais, meme contrainte de longueur. */
  seoDescriptionEn?: string;
  /** `serviceType` du JSON-LD. */
  serviceType: string;
  /** Idem en anglais. */
  serviceTypeEn?: string;
  /**
   * Ce que la famille resout, en trois ou quatre phrases.
   *
   * ELLE EST RENDUE A DEUX ENDROITS — la page de la famille et le bloc
   * correspondant de /services — et c est voulu : l index annonce, la page
   * developpe, et les deux ne peuvent pas se contredire.
   *
   * LES CINQ ONT ETE ETOFFEES D UNE PHRASE. Elles decrivaient le probleme du
   * lecteur, tres bien, puis s arretaient avant de dire ce qu il obtient. La
   * phrase ajoutee nomme le LIVRABLE, en reprenant les champs `quoi` et
   * `produit` des pieces juste en dessous — jamais une promesse de plus.
   * Un dirigeant de PME qui compare avec des agences a quatre ou huit mille
   * francs a besoin du concret, pas d un adjectif de plus.
   */
  resout: string;
  /** Idem en anglais. Absent = la page retombe sur `resout`. */
  resoutEn?: string;
  /** Les prestations, dans l ordre de lecture. */
  pieces: readonly Piece[];
  /** Ce qui n est pas compris, et vers quoi renvoyer. */
  horsPerimetre: readonly HorsPerimetre[];
  /** Deux ou trois questions propres a la famille. */
  questions: readonly Question[];
  /** Amorce du lien WhatsApp — repli si l assistant ne demarre pas. */
  amorce: string;
  /**
   * Idem en anglais. C EST UN LIEN COMPLET, pas une phrase : il se construit
   * avec `whatsapp()` comme son jumeau francais, sinon le message pre-rempli
   * n est pas encode et WhatsApp s ouvre vide.
   */
  amorceEn?: string;
  /**
   * Identifiant de conversation passe a l assistant par BoutonDevis.
   *
   * PAS DE JUMEAU `En` : c est un identifiant, pas une phrase. Le traduire
   * ferait deux sujets pour une seule conversation.
   */
  sujet: string;
  /**
   * UNE DEMONSTRATION FILMEE, quand la famille en a une. Optionnel, et il doit
   * le rester : une seule famille en porte une aujourd hui, et les deux autres
   * ne doivent pas se retrouver avec un cadre vide.
   *
   * `nom` designe un triplet de fichiers dans public/video/ — <nom>.mp4,
   * <nom>.webm et <nom>-poster.jpg. Les trois se tiennent : le navigateur
   * choisit le format qu il sait lire, et l affiche s affiche avant que la
   * premiere image arrive.
   *
   * `legende` N EST PAS DECORATIVE. Ce qui est filme est une demonstration,
   * pas une realisation cliente, et la phrase doit le dire a cote de l image
   * — guide de voix §8, meme regle que la legende des vignettes.
   */
  video?: {
    nom: string;
    legende: string;
    legendeEn?: string;
  };
};

/**
 * LA PHRASE DU DEVIS, ECRITE UNE FOIS.
 *
 * Elle n est rendue que si au moins une ligne de la page est effectivement
 * sur devis en base. Elle ne s excuse pas : le devis n est pas une derobade
 * mais la seule facon d annoncer un prix juste sur un support dont le tirage,
 * le format, le papier et l urgence ne sont pas encore connus
 * (prisma/seed.ts, docblock du catalogue).
 *
 * ELLE DIT « LES LIGNES ANNONCEES SUR DEVIS » ET NON « CES PRESTATIONS » : la
 * page du suivi est MIXTE — deux abonnements chiffres, une traduction sur
 * devis. Une phrase qui parlerait de toute la page y serait fausse le jour ou
 * elle a ete ecrite.
 *
 * UNE PHRASE EN A ETE RETIREE, ET ELLE NE REVIENT PAS : « Deux questions
 * posees avant de chiffrer donnent un prix juste du premier coup ». Ces deux
 * questions n existaient nulle part — ni dans le formulaire, ni dans
 * l assistant, ni dans aucun parcours. C etait une affirmation sur un processus
 * inexistant, et la regle de preuve du guide de voix §8 l interdit : ce qui
 * n est pas dans .agents/product-marketing.md ni dans docs/agents/veille/ est
 * reformule en fait verifiable, ou supprime. Le reste du raisonnement tient
 * sans elle — il porte sur ce qui fait varier un prix, ce qui est verifiable
 * chez n importe quel imprimeur.
 */
export const MENTION_DEVIS =
  "Les lignes annoncées sur devis le sont volontairement. Une prestation se chiffre mal hors contexte : le tirage, le format, le papier, le nombre de pages et l'urgence changent le prix, et un forfait affiché ne serait juste pour personne. Le devis part de ce que vous avez décidé, pas d'une moyenne. Deux allers-retours de correction sont compris, facturés au-delà.";

/**
 * LA MEME PHRASE EN ANGLAIS.
 *
 * ELLE GARDE LA RESTRICTION DU FRANCAIS — « the lines here that carry a quote »,
 * et non « these services ». La page du suivi est MIXTE : deux abonnements
 * chiffres, une traduction sur devis. Une phrase qui parlerait de toute la page
 * y serait fausse dans les deux langues.
 *
 * « quoted rather than priced » PLUTOT QU UN CALQUE DE L ETIQUETTE. Le libelle
 * anglais de « sur devis » appartient a lib/format.ts (`QUOTE_LABEL`) et n est
 * pas encore arrete ; cette phrase decrit donc la situation au lieu de recopier
 * un mot qui n existe pas encore, et elle restera vraie quel que soit le
 * libelle retenu.
 */
export const MENTION_DEVIS_EN =
  "The lines here that carry a quote rather than a price carry one on purpose. A job prices badly out of context: the print run, the size, the paper, the number of pages and the urgency all move the price, and a flat rate on display would be right for nobody. A quote starts from what you have decided, not from an average. Two rounds of corrections are included, charged beyond that.";

/**
 * LA MEME CHOSE EN UNE PHRASE — pour l accueil, et pour lui seul.
 *
 * POURQUOI ELLE EXISTE. `MENTION_DEVIS` etait rendue MOT POUR MOT a deux
 * endroits que le meme visiteur traverse a la suite : la carte du studio sur
 * l accueil, puis /services. Un paragraphe entier lu deux fois ne convainc pas
 * deux fois — il donne a lire un site qui se repete, et il coute a l accueil de
 * la place que la conversion utilise mieux.
 *
 * LE PARTAGE RETENU : /services garde le raisonnement ENTIER, parce que c est
 * le catalogue et que c est la que le lecteur compare douze « sur devis » ;
 * l accueil n en garde que la raison, celle qui repond a « pourquoi pas de
 * prix ». Les cinq pages de famille gardent la version longue elles aussi :
 * on y arrive sans avoir lu l accueil.
 *
 * ELLE N EST PAS UNE PARAPHRASE : c est la phrase centrale de `MENTION_DEVIS`,
 * reprise telle quelle. Deux formulations differentes du meme argument
 * divergeraient a la premiere correction — c est exactement ce que le guide de
 * voix §8 interdit.
 */
export const MENTION_DEVIS_COURTE =
  "Une prestation se chiffre mal hors contexte : le tirage, le format, le papier, le nombre de pages et l'urgence changent le prix, et un forfait affiché ne serait juste pour personne.";

/**
 * LA MEME EN ANGLAIS, et c est la phrase centrale de `MENTION_DEVIS_EN`
 * REPRISE MOT POUR MOT — exactement comme en francais. Deux formulations
 * anglaises du meme argument divergeraient a la premiere correction, et le
 * visiteur qui traverse l accueil puis /services lit les deux a la suite.
 */
export const MENTION_DEVIS_COURTE_EN =
  "A job prices badly out of context: the print run, the size, the paper, the number of pages and the urgency all move the price, and a flat rate on display would be right for nobody.";

/**
 * LE SEUL ENGAGEMENT DE REACTIVITE ADMIS, et il ne voyage pas seul.
 *
 * Il est tenable un dimanche de decembre, contrairement au « sous 24 h » qui
 * figurait sur trois pages sans avoir jamais ete decide. Il vivait au seul
 * formulaire ; il accompagne desormais AUSSI les deux endroits ou douze
 * lignes sur devis se presentent ensemble — l accueil et l index des
 * prestations —, parce que « sur devis » sans delai de reponse se lit comme
 * une porte fermee, et que c est precisement ce qu il ne doit pas etre.
 *
 * IL RESTE HORS DES CINQ PAGES DE FAMILLE. Cinq occurrences de plus le
 * transformeraient en formule de remplissage, et une promesse repetee cesse
 * d etre lue comme une promesse.
 */
export const MENTION_REPONSE = "Réponse le jour ouvrable suivant.";

/**
 * LE MEME ENGAGEMENT EN ANGLAIS, et il obeit a la meme regle : UNE SEULE
 * FORMULATION, au caractere pres. Le guide de voix §8 est explicite — un delai
 * qui change de mots change de sens aux yeux du lecteur —, et la contrainte ne
 * s allege pas parce qu on change de langue : c est l inverse, deux tournures
 * anglaises du meme engagement seraient lues comme deux engagements.
 *
 * PAS DE COMPTE D HEURES, ni ici ni ailleurs. « the next working day » est
 * tenable un dimanche de decembre ; « within 24 hours » ne l est pas.
 */
export const MENTION_REPONSE_EN = "A reply the next working day.";

/**
 * La mention obligatoire sous tout prix affiche, en phrase complete.
 *
 * Les deux mots qui portent l obligation viennent de lib/format.ts, ou vit
 * aussi la mention courte collee sous chaque montant : deux graphies du meme
 * mot finiraient par diverger, et celle-ci a valeur legale.
 */
export const MENTION_TVA = `Prix en francs suisses, ${TVA_LABEL}.`;

/**
 * SA VERSION ANGLAISE — et elle obeit a la meme regle que la francaise.
 *
 * LES DEUX MOTS QUI PORTENT L OBLIGATION NE SONT PAS ECRITS ICI. « VAT
 * included » vit dans lib/format.ts, a cote du formatage du montant, pour la
 * raison que le docblock francais donne deja : ce qui affiche un prix doit
 * avoir la mention sous la main, et une mention a valeur legale ne se recopie
 * pas. Ecrire « VAT included » en dur dans ce fichier creerait la seconde
 * graphie que le francais s interdit precisement d avoir.
 *
 * CE DOCBLOCK DISAIT « pas avant que lib/format.ts expose un TVA_LABEL_EN ».
 * La condition est remplie : `mentionTva(locale)` EST ce jumeau, expose en
 * fonction plutot qu en constante parce que la table `MENTIONS_TVA` y est
 * indexee par `Locale` — ajouter une langue casse la compilation tant que sa
 * colonne n est pas remplie, ce qu une constante par langue ne garantirait pas.
 */
export const MENTION_TVA_EN = `Prices in Swiss francs, ${mentionTva("en")}.`;

export const FAMILLES: Record<FamilleSlug, Famille> = {
  /* ------------------------------------------------------------------ */
  identite: {
    h1: ["Identité, photos", "et réseaux, à Genève."],
    h1En: ["Identity, photos", "and social, in Geneva."],
    libelle: "Identité et réseaux",
    libelleEn: "Identity and social",
    seoTitre: "Logo, photos et réseaux sociaux à Genève",
    seoTitreEn: "Logo, photography and social media in Geneva",
    seoDescription:
      "Logotype, palette et photos de votre entreprise à Genève. La même identité du site à l'enseigne, et des images cadrées pour le site et vos réseaux.",
    seoDescriptionEn:
      "Logotype, palette and photos of your business in Geneva. One identity from site to shopfront sign, and images framed for the site and social media.",
    serviceType: "Identité visuelle, photographie et réseaux sociaux",
    serviceTypeEn: "Visual identity and business photography",
    resout:
      "Votre logotype a été dessiné une fois, il y a longtemps, et il ne dit plus ce que vous faites aujourd'hui. Vos devis, votre site et votre enseigne ne se ressemblent pas entre eux, et les seules images disponibles sortent d'un téléphone. Deux choses se règlent ici : une identité qui tient du site à l'enseigne — logotype, palette, typographies, et les règles qui disent où va quoi —, et des photographies prises sur votre lieu de travail, le jour où vous travaillez.",
    resoutEn:
      "Your logotype was drawn once, a long time ago, and it no longer says what you do today. Your quotes, your site and your shopfront sign look nothing like each other, and the only pictures you have came off a phone. Two things get settled here: an identity that holds from the site to the shopfront sign — logotype, palette, typefaces, and the rules that say what goes where — and photographs taken at your workplace, on a day you are working.",
    pieces: [
      {
        slug: "identite-logo",
        quoi: "Le logotype, ses déclinaisons, la palette et les typographies — puis les règles qui disent où va quoi. Le but n'est pas un beau dessin : c'est que votre site, vos cartes, vos devis et votre enseigne se reconnaissent au premier coup d'œil.",
        quoiEn:
          "The logotype, its variants, the palette and the typefaces — then the rules that say what goes where. The point is not a nice drawing: it is that your site, your cards, your quotes and your shopfront sign are recognisably yours at first glance.",
        produit: [
          "Un logotype et ses déclinaisons : fond clair, fond sombre, version d'une seule couleur",
          "Les fichiers vectoriels, qui passent d'une carte de visite à une enseigne sans se dégrader",
          "La palette et les typographies, fixées une fois pour toutes",
          "Une page de règles : tailles minimales, marges, et ce qu'on ne fait pas avec le logo",
        ],
        produitEn: [
          "A logotype and its variants: light background, dark background, one-colour version",
          "The vector files, which go from a business card to a shopfront sign without losing anything",
          "The palette and the typefaces, settled once and for all",
          "A page of rules: minimum sizes, margins, and what is not done with the logo",
        ],
        raisonDevis:
          "Un logotype se chiffre au nombre de pistes explorées et au nombre de supports à décliner. Repartir d'une marque qui existe n'est pas le même travail que partir d'une page blanche, et une enseigne ajoute ses propres contraintes de fabrication.",
        raisonDevisEn:
          "A logotype is priced by the number of directions explored and the number of items it has to be worked out for. Starting again from a mark that already exists is not the same work as starting from a blank page, and a shopfront sign brings its own manufacturing constraints.",
      },
      {
        slug: "photos",
        quoi: "Une séance sur votre lieu de travail : l'équipe, l'atelier ou le cabinet, les gestes du métier, et deux ou trois vues qui situent l'endroit. Vous n'avez pas de mise en scène à préparer — on travaille dans ce qui existe, le jour où vous travaillez.",
        quoiEn:
          "A session at your workplace: the team, the workshop or the practice, the work as it is done, and two or three wider views that place you. You have nothing to stage — we work with what is there, on a day you are working.",
        produit: [
          "Les images retouchées, livrées en deux tailles : une pour le site, une pour l'impression",
          "Les cadrages carré et vertical que réclament les réseaux sociaux",
          "Un portrait, si vous en voulez un",
          "Les images intégrées au site, si le site est fait ici",
        ],
        produitEn: [
          "The retouched images, delivered in two sizes: one for the site, one for print",
          "The square and vertical crops that social media ask for",
          "A portrait, if you want one",
          "The images put into the site, if the site is made here",
        ],
        raisonDevis:
          "Une séance se chiffre au temps passé sur place et au nombre d'images retenues. Un cabinet de deux pièces et un atelier avec sa cour ne demandent ni la même demi-journée ni le même matériel, et une prise de vue en extérieur dépend d'un jour qu'on choisit.",
        raisonDevisEn:
          "A session is priced by the time spent on site and the number of images kept. A two-room practice and a workshop with its yard do not call for the same half-day or the same kit, and shooting outside depends on picking the right day.",
      },

      {
        slug: "reseaux-sociaux",
        quoi: "Le calendrier du mois vous est proposé, vous le validez, et il part. Visuels, textes, publication aux heures utiles, réponses aux commentaires et aux messages : la ligne est tenue de bout en bout. La production est faite avec un partenaire de production du studio, et c'est le studio qui vous rend le travail.",
        /**
         * « de bout en bout » NE DEVIENT PAS « end-to-end ». Le terme est
         * sature chez les concurrents et interdit par le glossaire anglais §4 ;
         * la phrase dit donc ou la chaine commence et ou elle finit, ce qui est
         * plus concret que l expression francaise.
         */
        quoiEn:
          "You are shown the month's calendar, you approve it, and it goes out. Visuals, wording, posting at the hours that matter, replies to comments and messages: the whole of it is held, from the calendar to the last reply. The production is done with a production partner of the studio, and it is the studio that hands the work back to you.",
        produit: [
          "Un calendrier mensuel proposé à l'avance, et validé par vous",
          "Les visuels et les textes, tenus dans votre identité",
          "La publication programmée, sans que vous ayez à y penser",
          "Le suivi des commentaires et des messages reçus",
          "Un point sur ce qui a été publié, et sur ce qu'on change le mois suivant",
        ],
        produitEn: [
          "A monthly calendar put to you in advance, and approved by you",
          "The visuals and the wording, held to your identity",
          "The posting scheduled, without you having to think about it",
          "Comments and incoming messages kept up with",
          "A look back at what went out, and at what changes the month after",
        ],
        raisonDevis:
          "Le volume décide de tout : quelques publications par mois sur un seul réseau et un rythme soutenu sur trois réseaux avec de la vidéo ne se produisent pas dans le même temps. Le devis part du rythme que vous voulez tenir, pas d'un forfait qui n'irait à personne.",
        raisonDevisEn:
          "Volume decides everything: a few posts a month on one network and a steady rhythm on three networks with video do not take the same time to make. The quote starts from the rhythm you want to keep, not from a flat rate that would suit nobody.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "L'impression de vos cartes et de vos affiches",
        quoiEn: "Printing your cards and your posters",
        href: "/services/imprimes",
        ou: "Imprimés",
        ouEn: "Print",
      },
      {
        quoi: "Le site qui portera cette identité",
        quoiEn: "The site that will carry this identity",
        href: "/services",
        ou: "Les formules de site",
        ouEn: "The site packages",
      },
      {
        quoi: "La carte et les supports de salle d'un restaurant",
        quoiEn: "The menu and a restaurant's front-of-house pieces",
        href: "/services/imprimes",
        ou: "Imprimés",
        ouEn: "Print",
      },

      {
        quoi: "La publicité payante et son budget média",
        quoiEn: "Paid advertising and its media budget",
        href: null,
        ou: "hors catalogue",
        ouEn: "not in the catalogue",
      },
    ],
    questions: [
      {
        q: "Je garde mon logo. Vous pouvez faire le reste ?",
        qEn: "I'm keeping my logo. Can you do the rest?",
        r: "Oui. Beaucoup de logos n'ont pas besoin d'être refaits, seulement d'être remis au propre et redessinés en fichier vectoriel, avec une palette et des typographies qui tiennent autour. On part de ce qui existe quand ce qui existe est bon, et ça se voit sur le devis.",
        rEn: "Yes. Plenty of logos do not need redrawing from scratch, only tidying up and redrawing as a vector file, with a palette and typefaces that hold together around them. We start from what exists when what exists is good, and that shows on the quote.",
      },
      {
        q: "Combien de propositions de logo ?",
        qEn: "How many logo proposals?",
        r: "Le nombre de pistes se fixe au devis, avant de commencer, et deux allers-retours de correction sont compris — facturés au-delà. C'est écrit noir sur blanc pour que personne n'ait à compter à la fin.",
        rEn: "The number of directions is set on the quote, before anything starts, and two rounds of corrections are included — charged beyond that. It is written down in plain words so that nobody has to count at the end.",
      },
      {
        q: "Je veux des photos, mais je n'ai pas de site chez vous.",
        qEn: "I want photographs, but my site isn't one of yours.",
        r: "Ces deux prestations se prennent seules. Le site n'est pas un préalable, et rien ne vous oblige à en commander un ensuite : vous repartez avec vos fichiers, utilisables partout.",
        rEn: "Both of these can be taken on their own. A site is not a prerequisite, and nothing obliges you to order one afterwards: you leave with your files, usable anywhere.",
      },

      {
        q: "Vous publiez à ma place, ou je dois valider chaque publication ?",
        qEn: "Do you post for me, or do I have to approve every post?",
        r: "Vous validez le calendrier du mois, une fois, et ensuite ça part. Si vous préférez relire chaque publication avant qu'elle sorte, c'est possible aussi — ça se décide au départ, pas en cours de route.",
        rEn: "You approve the month's calendar, once, and after that it goes out. If you would rather read every post before it appears, that works too — it is decided at the start, not halfway through.",
      },
      {
        q: "Qui fait le travail ?",
        qEn: "Who does the work?",
        r: "La production est faite avec un partenaire de production du studio. C'est nous qui portons le calendrier, qui vous répondons et qui vous rendons le travail : vous n'avez qu'une conversation à suivre.",
        rEn: "The production is done with a production partner of the studio. We are the ones who carry the calendar, who answer you and who hand the work back: there is only one conversation for you to follow.",
      },
      {
        q: "Je n'ai pas de site chez vous. C'est bloquant ?",
        qEn: "My site isn't one of yours. Is that a problem?",
        r: "Non. La ligne se prend seule, sans site chez nous. Si vous en avez un ailleurs, les publications renvoient dessus — il faut simplement qu'il tienne debout sur un téléphone, sinon le trafic qu'on lui envoie ne sert à rien.",
        rEn: "No. This can be taken on its own, with no site of ours behind it. If you have one elsewhere, the posts point to it — it just has to hold up on a phone, otherwise sending people to it achieves nothing.",
      },
    ],
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour mon identité et mes photos.",
    ),
    amorceEn: whatsapp(
      "Hello, I'd like a quote for my identity and my photographs.",
    ),
    sujet: "devis-identite",
  },

  /* ------------------------------------------------------------------ */
  imprimes: {
    h1: ["Vos imprimés,", "à Genève."],
    h1En: ["Your printed pieces,", "in Geneva."],
    libelle: "Imprimés",
    libelleEn: "Print",
    seoTitre: "Imprimés à Genève — cartes, affiches et supports de restaurant",
    seoTitreEn: "Print in Geneva — cards, posters and restaurant material",
    seoDescription:
      "Cartes de visite 85 × 55 et affiches d'événement, à Genève. Conception, fichiers prêts à imprimer, tirage commandé et contrôlé. Sur devis.",
    seoDescriptionEn:
      "Business cards 85 × 55 and event posters, in Geneva. Design, print-ready files, and the print run ordered and checked. Priced by quote.",
    serviceType: "Conception et impression de supports",
    serviceTypeEn: "Print design and production",
    resout:
      "Vous n'avez plus de cartes à donner, ou celles qui restent ne ressemblent plus à votre entreprise. Une affiche doit partir en vitrine la semaine prochaine et personne dans la maison ne sait la faire. Deux objets qu'on croise tous les jours, et qui font l'essentiel du contact hors écran : la carte qu'on garde, l'affiche qu'on lit de la rue. Les deux ressortent dans votre identité, avec leurs fichiers prêts à imprimer — et pour les cartes, le tirage commandé, contrôlé et livré.",
    resoutEn:
      "You have run out of cards to hand over, or the ones left no longer look like your business. A poster has to go up in the window next week and nobody in the place knows how to make one. Two everyday objects, and between them they carry most of the contact that happens away from a screen: the card people keep and the poster read from the street. Both come back in your identity, with their print-ready files — and for the cards, the print run ordered, checked and delivered.",
    pieces: [
      {
        slug: "carte-visite",
        quoi: "Le format standard, 85 × 55 millimètres, recto-verso. On choisit le papier ensemble — un mat épais ne se tient pas en main comme un brillant fin — puis nous nous occupons du fichier, de l'imprimeur et du contrôle avant tirage. Vous recevez les cartes, pas un fichier à débrouiller.",
        quoiEn:
          "The standard size, 85 × 55 millimetres, both sides. The paper is chosen together — a thick matt does not sit in the hand like a thin gloss — then we handle the file, the printer and the proof check before printing. You receive the cards, not a file to work out for yourself.",
        produit: [
          "Le dessin recto-verso, décliné pour chaque personne de l'équipe si besoin",
          "Le fichier d'impression aux normes : fonds perdus, marques de coupe, profil couleur",
          "Le tirage commandé, contrôlé et livré",
          "Les fichiers conservés : un retirage ne repart pas de zéro",
        ],
        produitEn: [
          "The design for both sides, worked out for each person on the team if needed",
          "The print file to spec: bleed, crop marks, colour profile",
          "The print run ordered, checked and delivered",
          "The files kept: a reprint does not start from scratch",
        ],
        raisonDevis:
          "Le tirage, le format, le papier et l'urgence changent tout : une petite série sur un papier courant et un gros tirage sur un papier texturé avec marquage n'ont pas le même prix chez l'imprimeur. Le devis est fait sur le papier que vous aurez choisi.",
        raisonDevisEn:
          "The print run, the size, the paper and the urgency change everything: a short run on ordinary stock and a large run on textured stock with a special finish do not cost the same at the printer's. The quote is made on the paper you have chosen.",
      },
      {
        slug: "affiche-evenement",
        quoi: "Une affiche qui se lit de loin et qui dit une chose : la date, l'offre, ou le poste à pourvoir. Elle sort en fichier prêt à imprimer, déclinée aux formats dont vous avez besoin — la vitrine, le A4 qu'on distribue, et le carré pour vos réseaux.",
        quoiEn:
          "A poster that reads from a distance and says one thing: the date, the offer, or the job you are hiring for. It comes out as a print-ready file, in the sizes you need — the window, the A4 you hand out, and the square one for your social media.",
        produit: [
          "L'affiche dessinée, dans votre identité",
          "Les déclinaisons de format : vitrine, A4, carré pour les réseaux",
          "Le fichier prêt à imprimer, à donner à n'importe quel imprimeur",
          "Le fichier source conservé : la même affiche resservira à la date suivante",
        ],
        produitEn: [
          "The poster designed, in your identity",
          "The other sizes: window, A4, square for social media",
          "The print-ready file, to give to any printer",
          "The source file kept: the same poster will serve again for the next date",
        ],
        raisonDevis:
          "Une affiche seule et une série déclinée sur l'année ne demandent pas le même travail, et le format d'impression ne se décide pas avant qu'on sache où elle sera posée.",
        raisonDevisEn:
          "A single poster and a series running across the year are not the same amount of work, and the print size is not decided before it is known where the poster will go.",
      },

      {
        slug: "la-carte",
        quoi: "La carte reprise en entier : l'ordre des sections, la hiérarchie, la lisibilité des prix, et la place des mentions obligatoires. Elle ressort en trois objets — les fichiers d'impression, une version en ligne lisible sur téléphone, et le QR qui l'ouvre.",
        quoiEn:
          "The whole menu reworked: the order of the sections, the hierarchy, how legible the prices are, and where the required legal wording goes. It comes back as three things — the print files, an online version readable on a phone, and the QR code that opens it.",
        produit: [
          "La carte redessinée, section par section",
          "Les fichiers prêts à imprimer, au format de vos porte-cartes",
          "La version en ligne, lisible sur téléphone",
          "Le QR qui l'ouvre — à poser sur les tables, en vitrine ou sur l'addition",
          "Le fichier source conservé : le prochain changement de prix ne repart pas de zéro",
        ],
        produitEn: [
          "The menu redesigned, section by section",
          "The print-ready files, sized to your menu holders",
          "The online version, readable on a phone",
          "The QR code that opens it — for the tables, the window or the bill",
          "The source file kept: the next price change does not start from scratch",
        ],
        raisonDevis:
          "Une carte de douze lignes et une carte de quatre pages avec les vins et les suggestions du jour n'occupent pas le même temps, et l'impression dépend du format, du papier et du nombre d'exemplaires. Le devis se fait sur votre carte, pas sur une carte moyenne.",
        raisonDevisEn:
          "A twelve-line menu and a four-page menu with the wines and the day's specials do not take the same time, and printing depends on the size, the paper and the number of copies. The quote is made on your menu, not on an average one.",
      },
      {
        slug: "chevalets",
        quoi: "Le petit chevalet qui tient debout sur la table : la suggestion du moment d'un côté, le QR de la carte et le code wifi de l'autre. C'est ce que le client a sous les yeux pendant qu'il attend, et c'est le support le moins cher à renouveler.",
        quoiEn:
          "The little table tent that stands up on the table: the suggestion of the moment on one side, the menu QR code and the wifi password on the other. It is what the customer has in front of them while they wait, and it is the cheapest piece to renew.",
        produit: [
          "Le chevalet dessiné, deux ou trois faces selon le pliage",
          "Le QR de la carte en ligne, testé",
          "Le code wifi placé de façon à pouvoir changer sans refaire tout le chevalet",
          "Le fichier d'impression, et le tirage si vous préférez",
        ],
        produitEn: [
          "The table tent designed, two or three faces depending on the fold",
          "The QR code for the online menu, tested",
          "The wifi password placed so that it can change without redoing the whole table tent",
          "The print file, and the print run too if you would rather",
        ],
        raisonDevis:
          "Le format, le pliage, le papier et le nombre de tables décident du tirage — et un chevalet qui reste en terrasse ne se protège pas comme un chevalet d'intérieur.",
        raisonDevisEn:
          "The size, the fold, the paper and the number of tables decide the print run — and a table tent that stays out on the terrace is not protected the way one that stays indoors is.",
      },
      {
        slug: "carte-fidelite",
        quoi: "Le format qui tient dans un portefeuille, dix cases, et un dessin qui donne envie de la garder plutôt que de la vider de sa poche le soir même. Le tampon reste un tampon : rien à installer, rien à expliquer au client, rien qui tombe en panne.",
        quoiEn:
          "Wallet-sized, ten boxes, and a design that makes people want to keep it rather than empty it out of a pocket the same evening. The rubber stamp stays a rubber stamp: nothing to install, nothing to explain to the customer, nothing that breaks down.",
        produit: [
          "La carte dessinée, recto-verso",
          "Les conditions écrites au dos, en clair",
          "Le fichier d'impression, et le tirage si vous préférez",
          "Le tampon assorti, si vous n'en avez pas",
        ],
        produitEn: [
          "The card designed, both sides",
          "The terms written on the back, in plain words",
          "The print file, and the print run too if you would rather",
          "The matching rubber stamp, if you do not have one",
        ],
        raisonDevis:
          "Le tirage fait le prix : une centaine de cartes et plusieurs milliers ne se commandent pas au même tarif, et le papier change la main.",
        raisonDevisEn:
          "The print run makes the price: a hundred cards and several thousand are not ordered at the same rate, and the paper changes how it feels in the hand.",
      },
      {
        slug: "bons-cadeaux",
        quoi: "Le bon qu'on offre, avec son étui : un montant ou une prestation, un numéro pour le suivre, une date de validité. C'est un objet qu'on donne en main propre — il doit se tenir, sinon il ne fait pas envie et il ne revient jamais en caisse.",
        quoiEn:
          "The voucher you give, with its sleeve: an amount or a service, a number to track it, an expiry date. It is handed over in person — it has to feel like something, or it will not tempt anyone and it will never come back to the till.",
        produit: [
          "Le bon dessiné, avec l'emplacement du montant ou de la prestation",
          "La numérotation, pour suivre ce qui a été vendu et ce qui a été utilisé",
          "L'étui ou l'enveloppe assortis",
          "Les déclinaisons de saison : Noël, Saint-Valentin, fête des mères",
        ],
        produitEn: [
          "The voucher designed, with the space for the amount or the service",
          "The numbering, to track what has been sold and what has been used",
          "The matching sleeve or envelope",
          "The seasonal versions: Christmas, Valentine's Day, Mother's Day",
        ],
        raisonDevis:
          "Le nombre de bons, le papier, la numérotation et l'étui font le prix, et une série de Noël ne se commande pas comme une série tenue toute l'année.",
        raisonDevisEn:
          "The number of vouchers, the paper, the numbering and the sleeve make the price, and a Christmas run is not ordered the way a run kept going all year is.",
      },
      {
        slug: "pack-saisonnier",
        quoi: "Quatre fois par an, la salle change : la terrasse ouvre, la rentrée arrive, l'Escalade, puis Noël. Le pack prend le passage d'une saison à l'autre en une fois — l'affiche, les publications assorties, et la carte remise à jour.",
        /**
         * « l Escalade » RESTE EN FRANCAIS, sans glose. C est le nom propre de
         * la fete genevoise du 12 decembre : le lecteur anglophone vise ici est
         * celui qui VIT a Geneve, et traduire ou expliquer une fete locale a
         * quelqu un qui la fete chaque annee sonne faux. « la rentrée », a
         * l inverse, n a pas de nom en anglais et se dit par son moment.
         */
        quoiEn:
          "Four times a year the room changes: the terrace opens, September comes round, the Escalade, then Christmas. The set takes the move from one season to the next in one go — the poster, the matching posts, and the menu brought up to date.",
        produit: [
          "L'affiche de la saison, déclinée en vitrine et en A4",
          "Les publications assorties pour vos réseaux",
          "La carte mise à jour : prix, plats retirés, suggestions de saison",
          "Les fichiers d'impression, prêts à partir",
        ],
        produitEn: [
          "The season's poster, in a window size and in A4",
          "The matching posts for your social media",
          "The menu brought up to date: prices, dishes taken off, seasonal suggestions",
          "The print files, ready to go",
        ],
        raisonDevis:
          "Un passage de saison isolé et les quatre de l'année ne se chiffrent pas pareil, et ce que contient le pack se décide avec vous — une affiche seule, ou toute la salle.",
        raisonDevisEn:
          "One season change on its own and all four of the year are not priced the same, and what goes into the set is decided with you — a poster alone, or the whole room.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "Le logotype, la palette et les typographies que ces imprimés appliquent",
        quoiEn:
          "The logotype, the palette and the typefaces these printed pieces apply",
        href: "/services/identite",
        ou: "Identité & photographie",
        ouEn: "Identity & photography",
      },
      {
        quoi: "Le site, et le formulaire de demande qui va avec",
        quoiEn: "The site, and the enquiry form that goes with it",
        href: "/services",
        ou: "Les formules de site",
        ouEn: "The site packages",
      },
      {
        quoi: "L'enseigne, la vitrophanie grand format et le marquage de véhicule",
        quoiEn:
          "Shopfront signs, large-format window graphics and vehicle livery",
        href: null,
        ou: "hors catalogue",
        ouEn: "not in the catalogue",
      },

      {
        quoi: "La production de vos réseaux sociaux au mois",
        quoiEn: "Running your social media by the month",
        href: "/services/identite",
        ou: "Identité et réseaux",
        ouEn: "Identity and social",
      },
      {
        quoi: "La version anglaise, du site comme de la carte",
        quoiEn: "The English version, of the site as well as the menu",
        href: "/services/site-web",
        ou: "Site web",
        ouEn: "Website",
      },
      {
        quoi: "Les plateformes de réservation et de commande en ligne",
        quoiEn: "Online reservation and ordering platforms",
        href: null,
        ou: "hors catalogue",
        ouEn: "not in the catalogue",
      },
    ],
    questions: [
      {
        q: "Vous imprimez, ou je dois trouver un imprimeur ?",
        qEn: "Do you print, or do I have to find a printer?",
        r: "Les deux marchent. Pour les cartes de visite, le tirage est compris : nous commandons, nous contrôlons, vous recevez. Pour l'affiche, vous repartez avec le fichier prêt à imprimer et vous le donnez à qui vous voulez — ou nous nous en chargeons aussi, et ça se décide au devis.",
        rEn: "Either works. For business cards, the print run is included: we order it, we check it, you receive it. For the poster, you leave with the print-ready file and give it to whoever you like — or we take care of that too, and it is decided on the quote.",
      },
      {
        q: "Il me faut une affiche pour la semaine prochaine.",
        qEn: "I need a poster for next week.",
        r: "Le délai du studio est d'une semaine, et il court dès votre feu vert : vous n'avez rien à réunir avant de démarrer. Reste le tirage lui-même, qui suit le calendrier de l'imprimeur et non le nôtre — on le vérifie avant de lancer, pas après.",
        /**
         * LA SEULE OCCURRENCE DE « one week » DE CE FICHIER, et elle porte son
         * point de depart dans la meme phrase — « from your go-ahead » —, comme
         * l exige le guide de voix §5. Ne pas l etendre a un logotype, a une
         * seance photo ou a une carte de restaurant : le positionnement ne
         * porte ce delai que sur le site.
         */
        rEn: "The studio works to one week, and it runs from your go-ahead: you have nothing to gather before it starts. What is left is the printing itself, which follows the printer's schedule and not ours — we check that before anything goes to press, not after.",
      },
      {
        q: "Je n'ai pas d'identité, juste un vieux logo.",
        qEn: "I have no identity, just an old logo.",
        r: "On fait avec. Un imprimé se dessine autour de ce qui existe, et s'il faut d'abord remettre le logo au propre, ça apparaît sur le devis plutôt que dans une surprise à la fin.",
        rEn: "That works. A printed piece is designed around what exists, and if the logo has to be tidied up first, that appears on the quote rather than as a surprise at the end.",
      },

      {
        q: "Je n'ai pas de site chez vous.",
        qEn: "My site isn't one of yours.",
        r: "Cette ligne est ouverte à qui n'a pas de site chez nous. Elle vit à part des formules, elle est tenue depuis le début du studio, et elle se commande seule.",
        rEn: "This is open to anyone whose site is not one of ours. It sits apart from the packages, it has been part of the studio from the start, and it can be ordered on its own.",
      },
      {
        q: "Ma carte change tous les mois.",
        qEn: "My menu changes every month.",
        r: "C'est prévu : le fichier source reste ici et il est fait pour être repris. Un changement de prix ou de plat ne redemande pas le travail de mise en page du départ — seulement la mise à jour et les nouveaux fichiers d'impression.",
        rEn: "That is expected: the source file stays here and it is built to be picked up again. A change of price or of dish does not call for the layout work of the first time — only the update and the new print files.",
      },
      {
        q: "Vous imprimez, ou vous livrez les fichiers ?",
        qEn: "Do you print, or do you deliver the files?",
        r: "Ça se décide au devis. Nous pouvons livrer les fichiers prêts à imprimer, que vous donnez à votre imprimeur habituel, ou nous occuper du tirage et vous livrer les supports finis.",
        rEn: "That is decided on the quote. We can deliver print-ready files for you to give to your usual printer, or take care of the print run and deliver the finished pieces.",
      },
    ],
    amorce: whatsapp("Bonjour, j'aimerais un devis pour mes imprimés."),
    amorceEn: whatsapp("Hello, I'd like a quote for my print work."),
    sujet: "devis-imprimes",
  },

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  "site-web": {
    h1: ["Votre site web,", "à Genève."],
    h1En: ["Your website,", "in Geneva."],
    libelle: "Site web",
    libelleEn: "Website",
    seoTitre: "Site web à Genève — création, hébergement et suivi",
    seoTitreEn: "Website in Geneva — build, hosting and upkeep",
    seoDescription:
      "Hébergement, domaine, mises à jour, sauvegardes et version anglaise de votre site, à Genève. Le suivi démarre la 2ᵉ année, prix TVA comprise.",
    seoDescriptionEn:
      "Hosting, domain, updates, backups and the English version of your site, in Geneva. Upkeep starts in the second year, prices VAT included.",
    serviceType: "Création, hébergement et suivi de site web",
    /**
     * « maintenance » DISPARAIT EN ANGLAIS, alors qu il figure en francais.
     * Le glossaire anglais l interdit explicitement au profit de `upkeep`, et
     * l interdit porte sur le MOT ANGLAIS, pas sur le mot francais traduit :
     * l ecrire ici le ferait rentrer par la donnee structuree, c est-a-dire par
     * la porte que personne ne relit.
     */
    // « maintenance », et non « upkeep », ALORS QUE LE GLOSSAIRE L INTERDIT.
    // serviceType est une donnee structuree : son lecteur est une machine,
    // pas un visiteur. « Website maintenance » est un type de service
    // reconnu ; « upkeep » ne l est pas. Le glossaire gouverne ce qu un
    // humain lit a l ecran, pas les champs lus par les moteurs. C est le
    // SEUL endroit du site ou le mot est permis — voir glossaire §7.
    serviceTypeEn: "Website design, hosting and upkeep",
    resout:
      "Un site n'est pas un objet qu'on pose et qu'on oublie : il s'héberge, il se met à jour, il se sauvegarde, et le nom de domaine se renouvelle chaque année sous peine de tout perdre d'un coup. Le suivi prend ça en charge pour que vous n'ayez plus à y penser — et pour qu'il reste quelqu'un à qui écrire l'année d'après, quand un tarif change ou qu'une prestation s'ajoute. Il démarre la deuxième année : la première est comprise dans le prix du site. La version anglaise se prend ici aussi, et elle s'ajoute à ce qui est en ligne sans rien refaire.",
    resoutEn:
      "A site is not something you put down and forget: it has to be hosted, updated and backed up, and the domain name has to be renewed every year or the lot goes at once. Upkeep takes that on so you no longer have to think about it — and so there is still someone to write to the year after, when a rate changes or a service is added. It starts in the second year: the first is included in the price of the site. The English version is taken here too, and it is added to what is already online without redoing anything.",
    pieces: [
      {
        slug: "hebergement",
        quoi: "Le suivi des deux premières formules de site. L'hébergement, le nom de domaine renouvelé, les mises à jour, les sauvegardes et le certificat de sécurité. Il démarre la deuxième année : la première est comprise dans le prix du site.",
        quoiEn:
          "The upkeep for the first two site packages. Hosting, the domain name renewed, the updates, the backups and the security certificate. It starts in the second year: the first is included in the price of the site.",
        produit: [
          "L'hébergement du site",
          "Le nom de domaine renouvelé — il reste à votre nom, et il vous suit si vous partez",
          "Les mises à jour et le certificat de sécurité",
          "Les sauvegardes, pour pouvoir revenir en arrière",
        ],
        produitEn: [
          "Hosting for the site",
          "The domain name renewed — it stays in your name, and it goes with you if you leave",
          "The updates and the security certificate",
          "The backups, so it is possible to go back",
        ],
        suitFormules: ["la-vitrine", "le-site"],
      },
      {
        slug: "suivi-assistant",
        quoi: "Le suivi de la formule qui embarque l'assistant. Tout ce qui précède, plus l'assistant lui-même — il consomme des appels d'API tous les mois — et vos modifications de contenu comprises : un tarif qui change, une prestation qui s'ajoute, une photo à remplacer.",
        /**
         * LA FORMULE EST DESIGNEE PAR PERIPHRASE, en anglais comme en francais.
         * `L Assistant` ne se traduit pas et son nom est lu en base ; « the
         * package that carries the assistant » designe le palier sans le
         * nommer, exactement comme le francais.
         */
        quoiEn:
          "The upkeep for the package that carries the assistant. Everything above, plus the assistant itself — it uses API calls every month — and your content changes included: a rate that changes, a service that is added, a photograph to replace.",
        produit: [
          "Tout ce que comprend le suivi précédent",
          "L'assistant maintenu en service, appels d'API compris",
          "Vos modifications de contenu comprises",
          "L'alerte sur votre téléphone et le tableau de bord des demandes, tenus",
        ],
        produitEn: [
          "Everything the previous upkeep includes",
          "The assistant kept in service, API calls included",
          "Your content changes included",
          "The alert on your phone and the enquiries dashboard, both kept running",
        ],
        suitFormules: ["l-assistant"],
        obligatoire:
          "L'assistant consomme des appels d'API tous les mois ; sans le suivi, il s'arrête.",
        obligatoireEn:
          "The assistant uses API calls every month; without the upkeep, it stops.",
      },
      {
        /**
         * ELLE EST ICI ET PLUS SOUS LA RESTAURATION. La ligne s appelait
         * « Traduction de carte FR / EN » ; elle a ete renommee en base
         * « Traduction du site FR / EN » — c est une prestation de site, et sa
         * place est parmi ce qui s ajoute a un site deja en ligne. La laisser
         * avec les cartes de restaurant faussait le rangement du catalogue,
         * lib/catalogue-familles.ts compris, qui derive son index de ces
         * `pieces`.
         */
        slug: "traduction",
        quoi: "La version anglaise de votre site : rédigée et remise en page, pas passée à la machine. Genève travaille en deux langues, et l'anglais s'ajoute très bien à un site déjà en ligne — c'est pour ça que cette ligne se trouve ici. Si votre site est la formule qui embarque l'assistant, elle y est déjà comprise.",
        quoiEn:
          "The English version of your site: written and laid out again, not run through a machine. Geneva works in two languages, and English adds very well to a site that is already online — which is why this sits here. If your site is the package that carries the assistant, it is already included.",
        produit: [
          "La version anglaise rédigée, section par section",
          "La mise en page refaite : l'anglais n'occupe pas la même place que le français",
          "Les titres, les libellés de formulaire et les messages traduits eux aussi",
          "Le sélecteur de langue posé sur le site, et les métadonnées de la version anglaise",
        ],
        produitEn: [
          "The English version written, section by section",
          "The layout redone: English does not take up the same room as French",
          "The headings, the form labels and the messages translated as well",
          "The language switch put on the site, and the metadata for the English version",
        ],
        raisonDevis:
          "Le prix suit le nombre de signes et le nombre de pages : une page unique n'est pas un site de six sections, et la mise en page est à refaire dans les deux cas. Une carte de restaurant se traduit aussi — ça se dit au devis.",
        raisonDevisEn:
          "The price follows the number of characters and the number of pages: a single page is not a site of six sections, and the layout has to be redone either way. A restaurant menu can be translated too — that is said on the quote.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "La refonte du site elle-même, et les trois formules",
        quoiEn: "The rebuild of the site itself, and the three packages",
        href: "/services",
        ou: "Les formules de site",
        ouEn: "The site packages",
      },
      {
        quoi: "Une page de plus, une fonction qui n'existait pas au départ",
        quoiEn: "One more page, a function that was not there at the start",
        href: "/services",
        ou: "Le catalogue",
        ouEn: "The catalogue",
      },
      {
        quoi: "La production de vos réseaux sociaux au mois",
        quoiEn: "Running your social media by the month",
        href: "/services/identite",
        ou: "Identité et réseaux",
        ouEn: "Identity and social",
      },
      {
        quoi: "La reprise d'un site fait ailleurs",
        quoiEn: "Taking over a site made elsewhere",
        href: null,
        ou: "à regarder avant d'être chiffré",
        ouEn: "to be looked at before it can be quoted",
      },
    ],
    questions: [
      {
        q: "Le suivi est-il obligatoire ?",
        qEn: "Is the upkeep compulsory?",
        r: "Avec les deux premières formules, non : le site est à vous, et vous pouvez l'héberger ailleurs. Avec la formule qui embarque l'assistant, oui — c'est le prix affiché ci-dessus, et il est annoncé à la signature, pas découvert après. L'assistant consomme des appels d'API en permanence ; sans le suivi, il s'arrête.",
        /**
         * ELLE RENVOIE AU « prix affiche ci-dessus » ET NE LE RECOPIE PAS, en
         * anglais comme en francais. Aucun montant n est ecrit dans ce fichier
         * — ils viennent tous de Postgres —, et un chiffre recopie dans une
         * phrase de FAQ est un chiffre qui devient faux le jour ou la base
         * change. C est aussi ce qui evite d avoir a coller « VAT included »
         * dans une reponse de FAQ.
         */
        rEn: "With the first two packages, no: the site is yours, and you can host it elsewhere. With the package that carries the assistant, yes — it is the price shown above, and it is stated when you sign, not discovered afterwards. The assistant uses API calls all the time; without the upkeep, it stops.",
      },
      {
        q: "À partir de quand est-ce que ça se paie ?",
        qEn: "When does it start being paid for?",
        r: "La deuxième année. La première est comprise dans le prix du site, assistant compris. Le renouvellement se joue donc après douze mois de service rendu, pas au moment où vous décidez d'acheter.",
        rEn: "The second year. The first is included in the price of the site, assistant included. So the renewal comes up after twelve months of service already given, not at the moment you decide to buy.",
      },
      {
        q: "Et si je m'en vais ?",
        qEn: "And if I leave?",
        r: "Le nom de domaine est à votre nom : il vous appartient et il vous suit. Le site aussi. Le suivi s'arrête, et vous repartez avec ce que vous avez payé — il n'y a rien à récupérer chez nous.",
        rEn: "The domain name is in your name: it belongs to you and it goes with you. So does the site. The upkeep stops, and you leave with what you paid for — there is nothing of yours left with us to get back.",
      },
    ],
    amorce: whatsapp("Bonjour, j'aimerais un devis pour le suivi de mon site."),
    amorceEn: whatsapp("Hello, I'd like a quote for the upkeep of my site."),
    sujet: "devis-site-web",
    video: {
      nom: "site-web",
      legende:
        "Démonstration — un site fait pour cette page, pour une compagnie qui n'existe pas.",
      legendeEn:
        "Demonstration — a site made for this page, for a company that does not exist.",
    },
  },

  /* ------------------------------------------------------------------ */
};

/**
 * Les metadonnees d une page de famille.
 *
 * `openGraphPage()` est repris tel quel de lib/site.ts : Next fusionne les
 * metadata champ par champ mais SANS descendre dans les objets, si bien
 * qu une page qui ne declarerait qu une partie d `openGraph` perdrait
 * siteName, locale et type.
 *
 * LE BLOC `twitter` EST OBLIGATOIRE, et pas par cosmetique : sans lui la page
 * herite de celui du layout, ecrit pour l accueil — titre de l accueil, et une
 * description qui parle de refonte de site alors que la page vend des
 * imprimes ou une carte de restaurant. L image, elle, vient du fichier
 * app/opengraph-image et n a pas a etre redeclaree.
 *
 * ELLE LIT MAINTENANT `seoTitreEn` / `seoDescriptionEn`. Ce docblock disait
 * qu elle ne le faisait pas et POURQUOI : ce qui manquait n etait pas la
 * traduction — elle est ecrite au-dessus depuis le premier jour — mais la
 * ROUTE. Sans segment de langue dans l URL, la page anglaise et la francaise
 * auraient partage le meme `canonical`, et deux pages differentes sous une
 * seule adresse canonique est une faute de referencement. Les cinq segments
 * `app/(site)/en/services/<famille>/` existent : la condition est levee.
 *
 * @param locale LA LANGUE DE LA PAGE, « fr » par defaut. Le defaut n est pas
 *   une commodite : les cinq appels francais passent desormais `"fr"`
 *   explicitement, mais le defaut garantit qu un sixieme appel ecrit sans
 *   locale rende le francais plutot qu une page a moitie traduite.
 *
 * LE REPLI EST LE FRANCAIS, comme partout ailleurs dans ce fichier :
 * `seoTitreEn ?? seoTitre`. Une balise `<title>` vide vaudrait moins qu une
 * balise francaise sur une page anglaise — la premiere ne dit rien, la seconde
 * dit au moins de quoi la page parle.
 *
 * `alternatesPage` REMPLACE LE `{ canonical }` ECRIT A LA MAIN, et c est ce qui
 * change pour les cinq pages FRANCAISES : elles gagnent leurs `hreflang`.
 * C est la condition meme du couple — la documentation de Google demande que
 * CHAQUE page du groupe se declare elle-meme ET declare sa jumelle ; une page
 * francaise muette ferait ignorer le groupe entier, y compris cote anglais.
 * Tant que `/services/<famille>` n est pas dans `CHEMINS_TRADUITS`
 * (lib/i18n.ts), `alternatesPage` n emet que `fr-CH` et `x-default`, tous deux
 * sur l URL francaise : l ajout est inoffensif avant, et complet apres.
 */
export function metadataFamille(
  slug: FamilleSlug,
  locale: Locale = LOCALE_DEFAUT,
): Metadata {
  const famille = FAMILLES[slug];
  const enAnglais = locale === "en";
  const titre = enAnglais
    ? (famille.seoTitreEn ?? famille.seoTitre)
    : famille.seoTitre;
  const description = enAnglais
    ? (famille.seoDescriptionEn ?? famille.seoDescription)
    : famille.seoDescription;
  const titreComplet = `${titre} — ${SITE_NAME}`;
  // Le chemin est SANS prefixe de langue : `alternatesPage` et `openGraphPage`
  // posent `/en` elles-memes. Le lui donner deja prefixe le doublerait.
  const chemin = `/services/${slug}`;
  return {
    title: titre,
    description,
    alternates: alternatesPage(chemin, locale),
    openGraph: openGraphPage({ titre: titreComplet, description, chemin }, locale),
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description,
    },
  };
}
