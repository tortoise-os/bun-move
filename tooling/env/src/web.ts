import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Web app (Next.js) environment configuration
 * Uses NEXT_PUBLIC_ prefix for client-side variables
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_SUI_NETWORK: z
      .enum(["localnet", "devnet", "testnet", "mainnet"])
      .default("localnet"),
    NEXT_PUBLIC_SUI_RPC_URL: z.string().url().optional(),
    NEXT_PUBLIC_ENABLE_BURNER_WALLET: z
      .string()
      .transform((v) => v === "true")
      .default("true"),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK,
    NEXT_PUBLIC_SUI_RPC_URL: process.env.NEXT_PUBLIC_SUI_RPC_URL,
    NEXT_PUBLIC_ENABLE_BURNER_WALLET:
      process.env.NEXT_PUBLIC_ENABLE_BURNER_WALLET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  emptyStringAsUndefined: true,
});

export type WebEnv = typeof env;
