// Generated by Wrangler on Fri Jul 07 2023 08:10:34 GMT-0700 (Pacific Daylight Time)
export interface Env {
  GRAPHQL_BASE_ENDPOINT: "/";
  GRAPHQL_KV_CACHE: "";
  DATABASE_URL: string;
}

declare global {
  // Declare types for replace variables
  const _APP_ENV: "development" | "production" | "staging";
  const _AUTH_COOKIE_NAME: string;
}

export {};
