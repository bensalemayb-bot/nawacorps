import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification de l administration — bloc B11.
 *
 * ZERO DEPENDANCE, et ce n est pas une coquetterie. next-auth apporterait des
 * fournisseurs OAuth, une base de sessions et un modele d utilisateurs pour un
 * besoin qui tient en une phrase : une seule personne, un seul mot de passe.
 * bcrypt servirait a stocker un hache en base — or le mot de passe ne va JAMAIS
 * en base ici, il vit dans l environnement. Hacher ce qu on ne stocke pas
 * n ajoute rien.
 *
 * LE MOT DE PASSE N EST NULLE PART AILLEURS QUE DANS .env. Pas en base, pas
 * dans le code, pas dans un commit. Le changer, c est editer une ligne et
 * redemarrer — aucune migration, aucun script.
 *
 * LE COOKIE NE CONTIENT AUCUN SECRET : une date d expiration et sa signature.
 * Rien a voler dedans. Un attaquant qui le lit apprend quand il expire, et
 * c est tout ; il ne peut pas en fabriquer un autre sans ADMIN_SECRET.
 */

const COOKIE = "admin_session";
const DUREE_S = 24 * 60 * 60;

/**
 * Options du cookie. httpOnly : le JavaScript de la page ne peut pas le lire,
 * donc une injection de script ne peut pas l exfiltrer. sameSite lax : il n est
 * pas envoye sur les requetes inter-sites, ce qui coupe le CSRF sur les PATCH
 * de l admin, tout en laissant fonctionner l arrivee par un lien.
 * secure UNIQUEMENT en production : l exiger en dev interdirait
 * http://localhost, ou il n y a pas de TLS.
 */
const optionsCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

/**
 * Comparaison a temps constant. timingSafeEqual EXIGE deux tampons de meme
 * longueur et jette sinon — ce qui, utilise naivement sur les chaines brutes,
 * transformerait la longueur du mot de passe en oracle. On compare donc les
 * empreintes SHA-256, toujours longues de 32 octets quelle que soit l entree.
 */
function egalConstant(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

function signer(charge: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(charge).digest("hex");
}

/**
 * Verifie le mot de passe soumis.
 *
 * ADMIN_PASSWORD absent ou vide => TOUJOURS faux. Une configuration incomplete
 * doit fermer la porte, jamais l ouvrir : sans cette garde, un .env oublie au
 * deploiement rendrait l administration accessible avec une chaine vide.
 */
export function motDePasseValide(fourni: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) return false;
  return egalConstant(fourni, attendu);
}

/**
 * Fabrique la valeur de session : « expiration.signature ». La signature porte
 * sur l expiration, donc reculer la date invalide le cookie — on ne peut pas
 * prolonger sa propre session sans le secret.
 */
export function creerSession(): { nom: string; valeur: string; options: typeof optionsCookie & { maxAge: number } } {
  const secret = process.env.ADMIN_SECRET ?? "";
  const expire = Date.now() + DUREE_S * 1000;
  const charge = String(expire);
  return {
    nom: COOKIE,
    valeur: `${charge}.${signer(charge, secret)}`,
    options: { ...optionsCookie, maxAge: DUREE_S },
  };
}

/** Options d effacement : meme cookie, duree nulle. */
export function effacerSession(): { nom: string; valeur: string; options: typeof optionsCookie & { maxAge: number } } {
  return { nom: COOKIE, valeur: "", options: { ...optionsCookie, maxAge: 0 } };
}

/**
 * Valide une valeur de cookie. Trois refus possibles, dans cet ordre : forme
 * illisible, signature fausse, session expiree. La signature est verifiee
 * AVANT l expiration — sinon on accorderait du credit a une date non signee.
 */
export function sessionValide(valeur: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !valeur) return false;

  const sep = valeur.lastIndexOf(".");
  if (sep <= 0) return false;

  const charge = valeur.slice(0, sep);
  const signature = valeur.slice(sep + 1);
  if (!egalConstant(signature, signer(charge, secret))) return false;

  const expire = Number(charge);
  return Number.isFinite(expire) && expire > Date.now();
}

/** Lit le cookie dans l en-tete Cookie brut d une requete. */
function lireCookie(request: Request): string | undefined {
  const brut = request.headers.get("cookie");
  if (!brut) return undefined;
  for (const morceau of brut.split(";")) {
    const [nom, ...reste] = morceau.trim().split("=");
    if (nom === COOKIE) return reste.join("=");
  }
  return undefined;
}

/** Garde des route handlers. Rend un booleen, jamais d exception. */
export function requireAdmin(request: Request): boolean {
  return sessionValide(lireCookie(request));
}

/**
 * Garde des Server Components. Meme verification, autre source : la page n a
 * pas d objet Request sous la main. cookies() est ASYNCHRONE depuis Next 15.
 */
export async function adminConnecte(): Promise<boolean> {
  const magasin = await cookies();
  return sessionValide(magasin.get(COOKIE)?.value);
}

export const COOKIE_ADMIN = COOKIE;
