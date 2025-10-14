import "./environment";

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const listFromEnv = (value: string | undefined): string[] | null => {
  if (!value) {
    return null;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const appConfig = {
  server: {
    host: process.env.HOST ?? "0.0.0.0",
    port: numberFromEnv(process.env.PORT, 3000),
  },
  cors: {
    allowedOrigins: listFromEnv(process.env.CORS_ALLOWED_ORIGINS) ?? ["*"],
  },
  logger: {
    level: (process.env.LOG_LEVEL ?? "info").toLowerCase(),
  },
} as const;

export type AppConfig = typeof appConfig;
