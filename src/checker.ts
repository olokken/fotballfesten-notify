import { requestTimeoutMs, searchWords, type WatchUrl } from "./config.js";

export type Match = {
  page: WatchUrl;
  word: string;
};

export async function checkPage(page: WatchUrl): Promise<Match[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(page.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "fotballfesten-url-checker/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const html = (await response.text()).toLowerCase();

    const matchedWords = searchWords.filter((word) => html.includes(word.toLowerCase()));

    if (matchedWords.length !== searchWords.length) {
      return [];
    }

    return [{ page, word: matchedWords.join(", ") }];
  } finally {
    clearTimeout(timeout);
  }
}
