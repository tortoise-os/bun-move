import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * API server environment configuration
 * All variables are server-side only
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug"),

    // Port configuration
    API_PORT: z.coerce.number().default(3001),

    // SUI Network
    SUI_NETWORK: z
      .enum(["localnet", "devnet", "testnet", "mainnet"])
      .default("localnet"),
    SUI_RPC_URL: z.string().url().default("http://localhost:9000"),
    SUI_FAUCET_URL: z.string().url().optional(),

    // Deployer (sensitive)
    DEPLOYER_ADDRESS: z.string().optional(),
    DEPLOYER_PRIVATE_KEY: z.string().optional(),

    // Database
    DATABASE_URL: z.string().url().optional(),

    // AI Integration
    SUI_AI_AGENT_ENABLED: z
      .string()
      .transform((v) => v === "true")
      .default("false"),
    SUI_AI_AGENT_MODEL: z.string().default("gpt-4"),
    NAUTILUS_TEE_ENDPOINT: z.string().url().optional(),
    NAUTILUS_API_KEY: z.string().optional(),

    // Walrus Storage
    WALRUS_ENDPOINT: z.string().url().optional(),
    WALRUS_BUCKET_ID: z.string().optional(),

    // Rate Limiting
    RATE_LIMIT_ENABLED: z
      .string()
      .transform((v) => v === "true")
      .default("true"),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

    // External APIs
    ETHERSCAN_API_KEY: z.string().optional(),
    COINGECKO_API_KEY: z.string().optional(),

    // Governance
    LAB_TOKEN_ADDRESS: z.string().optional(),
    GOVERNANCE_MULTISIG: z.string().optional(),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  emptyStringAsUndefined: true,
});

export type ApiEnv = typeof env;
