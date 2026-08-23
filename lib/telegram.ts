/**
 * Notification Telegram.
 *
 * CETTE FONCTION NE JETTE JAMAIS. Elle est appelee apres l enregistrement du
 * lead : une panne de Telegram, un token revoque ou un reseau coupe ne doivent
 * pas couter une demande client. Tout echec est journalise et avale.
 *
 * SECRET : le token vit dans l URL de l API. Il n est donc jamais journalise,
 * ni directement, ni au travers d une erreur — on ne remonte que le nom de
 * l erreur et, pour une reponse HTTP, le code et la description renvoyee par
 * Telegram (qui ne contient pas le token).
 */

const TIMEOUT_MS = 5000;

export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[telegram] non configuré — notification sautée, le lead est enregistré");
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let description = "";
      try {
        const body = (await res.json()) as { description?: string };
        description = body.description ?? "";
      } catch {
        // corps illisible : le code HTTP suffit
      }
      console.warn(`[telegram] échec HTTP ${res.status}${description ? ` — ${description}` : ""}`);
    }
  } catch (e) {
    // Volontairement pas e.message : il peut contenir l URL, donc le token.
    const nom = e instanceof Error ? e.name : "inconnue";
    console.warn(`[telegram] échec réseau (${nom}) — le lead reste enregistré`);
  } finally {
    clearTimeout(timer);
  }
}
