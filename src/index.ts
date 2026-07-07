import "dotenv/config";

import { isWithinInterval } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { checkIntervalMs, watchUrls } from "./config.js";
import { checkPage, type Match } from "./checker.js";
import { sendNotification } from "./notify.js";

const seenMatches = new Set<string>();
let isRunning = false;

function matchKey(match: Match): string {
  return `${match.page.url}:${match.word.toLowerCase()}`;
}

function formatMessage(match: Match): string {
  return [
    "Hit found!",
    `Page: ${match.page.name}`,
    `Word: ${match.word}`,
    `URL: ${match.page.url}`
  ].join("\n");
}

function isWithinNorwegianRunWindow(date = new Date()): boolean {
  const norwegianNow = toZonedTime(date, "Europe/Oslo");

  const start = new Date(norwegianNow);
  start.setHours(6, 30, 0, 0);

  const end = new Date(norwegianNow);
  end.setHours(23, 30, 0, 0);

  return isWithinInterval(norwegianNow, { start, end });
}

async function runCheck(): Promise<void> {
  if (!isWithinNorwegianRunWindow()) {
    console.log("Outside Norwegian run window 06:30-23:30, skipping check.");
    return;
  }

  if (isRunning) {
    console.log("Previous check is still running, skipping this minute.");
    return;
  }

  isRunning = true;
  console.log(`Checking ${watchUrls.length} URL(s) at ${new Date().toISOString()}`);

  try {
    const results = await Promise.allSettled(watchUrls.map((page) => checkPage(page)));

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Check failed:", result.reason);
        continue;
      }

      for (const match of result.value) {
        const key = matchKey(match);
        if (seenMatches.has(key)) {
          continue;
        }

        seenMatches.add(key);
        console.log(`New hit: ${match.page.name} matched "${match.word}"`);
        try {
          await sendNotification(formatMessage(match));
        } catch (error) {
          seenMatches.delete(key);
          console.error("Notification failed:", error);
        }
      }
    }
  } finally {
    isRunning = false;
  }
}

if (watchUrls.length === 0) {
  throw new Error("No URLs configured in src/config.ts");
}

void runCheck();
setInterval(() => void runCheck(), checkIntervalMs);
