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
  appName: process.env.APP_NAME ?? "qasa-backend",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  server: {
    host: process.env.HOST ?? "0.0.0.0",
    port: numberFromEnv(process.env.PORT, 3000),
  },
  cors: {
    allowedOrigins: listFromEnv(process.env.CORS_ALLOWED_ORIGINS) ?? ["*"],
  },
  logger: {
    level: (process.env.LOG_LEVEL ?? "info").toLowerCase(),
    general: {
      logLevel: (process.env.LOG_LEVEL ?? "info").toLowerCase(),
    },
    request: {
      enabled: process.env.REQUEST_LOGGING_ENABLED === "true",
      endpointThresholdMs: numberFromEnv(
        process.env.REQUEST_ENDPOINT_THRESHOLD_MS,
        1000
      ),
    },
  },
  statsd: {
    host: process.env.STATSD_HOST ?? "localhost",
    port: numberFromEnv(process.env.STATSD_PORT, 8125),
  },
  database: {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: numberFromEnv(process.env.DATABASE_PORT, 5432),
    user: process.env.DATABASE_USER ?? "postgres",
    password: process.env.DATABASE_PASSWORD ?? "postgres",
    database: process.env.DATABASE_NAME ?? "postgres",
    pool: {
      maxConnections: numberFromEnv(process.env.DATABASE_MAX_CONNECTIONS, 10),
      minConnections: numberFromEnv(process.env.DATABASE_MIN_CONNECTIONS, 2),
      idleTimeoutMillis: numberFromEnv(
        process.env.DATABASE_IDLE_TIMEOUT_MILLIS,
        30000
      ),
      connectionTimeoutMillis: numberFromEnv(
        process.env.DATABASE_CONNECTION_TIMEOUT_MILLIS,
        10000
      ),
      maxUses: numberFromEnv(process.env.DATABASE_MAX_USES, 0),
      acquireTimeoutMillis: numberFromEnv(
        process.env.DATABASE_ACQUIRE_TIMEOUT_MILLIS,
        10000
      ),
    },
    transactionTimeoutMs: numberFromEnv(
      process.env.DATABASE_TRANSACTION_TIMEOUT_MS,
      60000
    ),
    logging: {
      enabled: process.env.DATABASE_LOGGING_ENABLED === "true",
      logPoolStats: process.env.DATABASE_LOG_POOL_STATS === "true",
      logMemoryStats: process.env.DATABASE_LOG_MEMORY_STATS === "true",
      slowQueryThresholdMs: numberFromEnv(
        process.env.DATABASE_SLOW_QUERY_THRESHOLD_MS,
        1000
      ),
      transactionThresholdMs: numberFromEnv(
        process.env.DATABASE_TRANSACTION_THRESHOLD_MS,
        3000
      ),
    },
  },
} as const;

export type AppConfig = typeof appConfig;
