import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Shared environment schema for all packages
 * This validates environment variables at runtime and provides type-safe access
 */
export const sharedEnv = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug"),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  emptyStringAsUndefined: true,
});

/**
 * SUI network configuration schema
 */
export const suiNetworkSchema = {
  SUI_NETWORK: z
    .enum(["localnet", "devnet", "testnet", "mainnet"])
    .default("localnet"),
  SUI_RPC_URL: z.string().url().optional(),
  SUI_FAUCET_URL: z.string().url().optional(),
};

/**
 * Deployer configuration schema (server-only)
 */
export const deployerSchema = {
  DEPLOYER_ADDRESS: z.string().optional(),
  DEPLOYER_PRIVATE_KEY: z.string().optional(),
};

/**
 * AI integration schema
 */
export const aiIntegrationSchema = {
  SUI_AI_AGENT_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  SUI_AI_AGENT_MODEL: z.string().default("gpt-4"),
  NAUTILUS_TEE_ENDPOINT: z.string().url().optional(),
  NAUTILUS_API_KEY: z.string().optional(),
};

/**
 * Walrus storage schema
 */
export const walrusSchema = {
  WALRUS_ENDPOINT: z.string().url().optional(),
  WALRUS_BUCKET_ID: z.string().optional(),
};

/**
 * Database schema
 */
export const databaseSchema = {
  DATABASE_URL: z.string().url().optional(),
};

/**
 * Rate limiting schema
 */
export const rateLimitSchema = {
  RATE_LIMIT_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
};

// Re-export zod for convenience
export { z };
export { createEnv } from "@t3-oss/env-core";
