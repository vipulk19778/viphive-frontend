type LogMethod = (...values: unknown[]) => void;

const isProduction =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

export const logger: Record<"error" | "warn" | "info", LogMethod> = {
  error: (...values) => {
    if (!isProduction) console.error(...values);
  },
  warn: (...values) => {
    if (!isProduction) console.warn(...values);
  },
  info: (...values) => {
    if (!isProduction) console.info(...values);
  },
};
