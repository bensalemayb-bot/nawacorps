import { createHash } from "node:crypto";

/**
 * Hachage des adresses IP.
 *
 * Aucune IP n est stockee en clair : ni dans RateLimit, ni dans Conversation
 * (modele pose au bloc B2, meme convention).
 *
 * Le sel est indispensable. Sans lui, un sha256 nu d adresse IPv4 se casse par
 * force brute en quelques secondes — l espace ne fait que 2^32. On avertit donc
 * bruyamment plutot que de laisser croire a une anonymisation qui n en serait
 * pas, mais on ne jette pas : la limitation de debit doit continuer a
 * fonctionner, et un lead ne doit jamais etre perdu pour un probleme de config.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    console.warn(
      "[iphash] IP_HASH_SALT absent — hachage non sale, reversible par force brute. Renseignez-le dans .env.",
    );
  }
  return createHash("sha256").update(ip + (salt ?? "")).digest("hex");
}

/**
 * Adresse de l appelant : premier maillon de x-forwarded-for, repli "local".
 * En developpement (Next en direct) l en-tete est absent, d ou le repli — qui
 * regroupe alors toutes les requetes locales sous un meme compteur.
 */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (!xff) return "local";
  const first = xff.split(",")[0]?.trim();
  return first || "local";
}
