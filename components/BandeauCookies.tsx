"use client";

import { useEffect, useState } from "react";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

/**
 * LE BANDEAU D INFORMATION SUR LES COOKIES (25 octobre 2026, demande d Ayoub).
 *
 * IL INFORME, IL NE DEMANDE RIEN — et c est le droit, pas une paresse. Le
 * site ne range dans le navigateur que le strictement necessaire (inventaire
 * complet : /confidentialite#cookies) : « bnc-intro » en stockage de session,
 * la cle de ce bandeau en stockage local, et rien pour la mesure ni la
 * publicite. La nLPD n exige pas d accord pour cela ; elle exige la
 * transparence, que la page de confidentialite assure. Le bandeau n est que
 * le panneau qui y mene. Un bouton « Refuser » ici serait un leurre : il n y
 * a rien a refuser.
 *
 * >>> LE JOUR OU UNE MESURE D AUDIENCE OU UN TRACEUR ARRIVE, CE COMPOSANT NE
 * SUFFIT PLUS. <<< Il faudra un vrai choix, « Accepter » et « Refuser » a
 * egalite, l outil charge SEULEMENT apres accord (les visiteurs de France
 * voisine relevent de la directive ePrivacy, qui l impose), le choix
 * memorise et revocable — et la rubrique #cookies reecrite avec.
 *
 * LE CHOIX SE MEMORISE EN localStorage, sous `CLE`, dans un try/catch : en
 * navigation privee stricte ou avec le stockage bloque, `localStorage` jette.
 * Le bandeau reviendra alors a chaque page — gene minime, et jamais une
 * erreur qui casserait le chrome. La cle est listee sur /confidentialite :
 * la renommer, c est changer les deux pages legales.
 *
 * RIEN N EST RENDU COTE SERVEUR. `visible` part a `false` et ne passe a `true`
 * qu apres lecture du stockage, dans l effet : le HTML serveur ne peut pas
 * savoir ce que le navigateur a retenu, et rendre le bandeau d abord le ferait
 * clignoter chez tous ceux qui l ont deja ferme.
 *
 * MONTE PAR app/(site)/layout.tsx, HORS de #smoothWrap : il est en
 * position:fixed, et le translate3d du scroll inertiel casserait le fixed.
 * Sa place (binacore.css, `.bandeau-cookies`) : en bas a DROITE sur grand
 * ecran, pour laisser le coin gauche a la bulle du chat ; au-dessus de la
 * bulle sur telephone, ou la bulle prend toute la largeur. z-index 94 : sous
 * le chat (95), qui le recouvre quand il s ouvre, et sous le loader (130).
 * Sur les pages a hero, il attend que le pied du hero quitte l ecran : il
 * en recouvrait le second bouton (voir l effet ci-dessous).
 *
 * DES <a> NUS, pas des next/link : Interactions.tsx ne s initialise qu une
 * fois (decision B7).
 */
const CLE = "nawa-cookies";
const VALEUR = "vu";

export default function BandeauCookies({ locale }: { locale: Locale }) {
  const t = dictionnaire(locale);
  /** Pas encore ferme par le visiteur (lu dans le stockage au montage). */
  const [aMontrer, setAMontrer] = useState(false);
  /** Le pied du hero est a l ecran : le bandeau s efface devant lui. */
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    let vu = false;
    try {
      vu = window.localStorage.getItem(CLE) === VALEUR;
    } catch {
      // stockage bloque : on affiche, sans rien memoriser
    }
    if (vu) return;
    const pied = document.querySelector(".hero-foot");
    // Premiere mesure SYNCHRONE, avant d afficher : sans elle le bandeau
    // clignoterait une image sur l accueil, le temps du premier rappel de
    // l observateur ci-dessous.
    if (pied) {
      const r = pied.getBoundingClientRect();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroVisible(r.top < window.innerHeight && r.bottom > 0);
    }
    // Lecture d un systeme externe (le stockage du navigateur) au montage :
    // c est le cas d usage documente d un setState dans un effet.
    setAMontrer(true);

    // IL S EFFACE TANT QUE LE PIED DU HERO EST A L ECRAN. Mesure a 1280x800 :
    // en bas a droite, il recouvrait le second bouton du hero (« Voir … »),
    // seul bloc du site ancre en bas d ecran (voir .hero-foot, binacore.css).
    // Il apparait au premier defilement et y revient si l on remonte. Sans
    // hero (toutes les autres pages), il apparait tout de suite.
    // IntersectionObserver tient compte du translate3d du scroll inertiel.
    if (!pied || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
    obs.observe(pied);
    return () => obs.disconnect();
  }, []);

  function fermer() {
    try {
      window.localStorage.setItem(CLE, VALEUR);
    } catch {
      // stockage bloque : le bandeau se ferme pour cette page seulement
    }
    setAMontrer(false);
  }

  if (!aMontrer || heroVisible) return null;

  return (
    <div className="bandeau-cookies green" role="region" aria-label={t.cookies.region}>
      <p>
        {t.cookies.texte}{" "}
        <a className="lnk" href={`${lien(locale, "/confidentialite")}#cookies`}>
          {t.cookies.enSavoirPlus}
        </a>
      </p>
      <button type="button" className="btn" onClick={fermer}>
        {t.cookies.compris}
      </button>
    </div>
  );
}
