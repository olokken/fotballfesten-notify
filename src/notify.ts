type TelegramConfig = {
  botToken: string;
  chatId: string;
};

function getTelegramConfig(): TelegramConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error(
      "Missing Telegram config. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env."
    );
  }

  return { botToken, chatId };
}

export async function sendNotification(message: string): Promise<void> {
  const config = getTelegramConfig();
  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: config.chatId,
      text: message,
      disable_web_page_preview: false
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram notification failed: ${response.status} ${body}`);
  }
}
