# Fotballfesten URL Checker

Checks configured URLs once per minute and sends a Telegram message when a configured search word is found in the initial HTML.

## Setup

Install dependencies:

```sh
pnpm install
```

Copy the environment example:

```sh
cp .env.example .env
```

Create a Telegram bot:

1. Open Telegram and message `@BotFather`.
2. Run `/newbot` and copy the bot token.
3. Send any message to your new bot.
4. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in your browser.
5. Copy the `chat.id` value from the response.

Fill in `.env` with your Telegram values:

```sh
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Configure URLs And Search Words

Edit `src/config.ts`:

```ts
export const watchUrls = [
  {
    name: "Ticket page",
    url: "https://example.com/tickets"
  }
];

export const searchWords = ["available", "tickets", "fotball"];
```

Matching is case-insensitive and checks the raw initial HTML returned by `fetch`.

## Run

```sh
pnpm start
```

For development with auto-restart:

```sh
pnpm dev
```

## Hosting

The easiest Railway setup is deploying directly from GitHub. You do not need to publish a Docker image.

1. Push this repo to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Add these environment variables in Railway:

```sh
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
CHECK_INTERVAL_MS=60000
```

4. Use this start command:

```sh
pnpm start
```

This repo also includes a `Dockerfile`, so Railway can build it as a Docker app if you prefer. You still do not need to push an image to Docker Hub unless you specifically want that workflow.

## Notes

The app remembers matches in memory, so it will not spam you every minute for the same URL and word while the process keeps running. If you restart it, old matches can notify again.

Telegram notifications use the official Telegram Bot API.
