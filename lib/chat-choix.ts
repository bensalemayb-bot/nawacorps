/**
 * LES REPONSES SUGGEREES DE LEO — le format, et la seule fonction qui le lit.
 *
 * Le modele termine chaque message qui pose une question par une derniere
 * ligne `CHOIX: a | b | c` (regle ecrite dans lib/chat-prompt.ts). La route
 * /api/chat la retire du texte avant de le renvoyer, et le widget affiche les
 * options en boutons sous la bulle : un patron sur un chantier tape mal sur un
 * telephone, il touche mieux.
 *
 * POURQUOI UNE LIGNE DE TEXTE ET PAS UNE SORTIE JSON : la conversation passe
 * par Gemini ou Groq (lib/llm.ts) en texte libre, et une reponse JSON imposee
 * a chaque tour rendait le ton plus raide et coutait des jetons de sortie. Une
 * ligne a balise fixe se lit avec une expression reguliere ; si le modele
 * l oublie, il n y a simplement pas de boutons, jamais d erreur.
 *
 * TOUT CE QUI SORT D ICI EST BORNE : le texte vient d un modele, il s affiche
 * dans un bouton et repart comme message du visiteur. Quatre options au plus,
 * chacune courte, sans doublon.
 */

/** Au-dela, la rangee de boutons deborde du panneau sur un telephone. */
export const MAX_CHOIX = 4;
/** Une option est un bouton, pas une phrase. */
const MAX_LONGUEUR_CHOIX = 40;

/**
 * La balise, en francais comme en anglais : le prompt anglais l ecrit aussi `CHOIX:`.
 *
 * ELLE N EST PAS FORCEMENT EN DEBUT DE LIGNE. Le prompt demande une ligne a
 * part, mais gpt-oss (Groq) la colle souvent a la fin de la phrase : « … le
 * soir ? CHOIX: Appels manqués | … ». Une ancre `^` la laissait alors dans la
 * bulle, en texte brut. On prend donc la DERNIERE occurrence, ou qu elle soit,
 * jusqu a la fin de sa ligne.
 */
const LIGNE_CHOIX = /\s*\b(?:CHOIX|CHOICES)\s*:\s*([^\n]+)\s*$/i;

export function extraireChoix(reponse: string): { texte: string; choix: string[] } {
  const trouve = reponse.match(LIGNE_CHOIX);
  if (!trouve) return { texte: reponse.trim(), choix: [] };

  const vus = new Set<string>();
  const choix = trouve[1]
    .split("|")
    // Le modele glisse parfois des guillemets ou un point final : un bouton
    // n en a pas besoin.
    .map((c) => c.trim().replace(/^["«“]\s*|\s*["»”]$/g, "").replace(/\.$/, "").trim())
    .filter((c) => c.length > 0 && c.length <= MAX_LONGUEUR_CHOIX)
    .filter((c) => {
      const cle = c.toLowerCase();
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    })
    .slice(0, MAX_CHOIX);

  const texte = reponse.replace(LIGNE_CHOIX, "").trim();
  return { texte, choix };
}
