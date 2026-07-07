export type WatchUrl = {
  name: string;
  url: string;
};

export const watchUrls: WatchUrl[] = [
  {
    name: "Fotballfesten 1",
    url: "https://fanparks.fanparks.com/booking/fotballfesten-frogner-2026"
  }, 
  {
    name: "Fotballfesten 2",
    url: "https://fanparks.fanparks.com/booking/fotballfesten-frognerstadion-2026"
  },
  {
    name: "Fotballfesten 3",
    url: "https://fanparks.fanparks.com/booking/fotballfesten-ullevaal-2026"
  }, 
  {
    name: "Fotballfesten 4",
    url: "https://fanparks.fanparks.com/booking/fotballfesten-frogner-stadion-2026"
  },
];

export const searchWords = ["kjøp", "norge", "england"];

export const checkIntervalMs = Number(process.env.CHECK_INTERVAL_MS ?? 60_000);

export const requestTimeoutMs = 15_000;
