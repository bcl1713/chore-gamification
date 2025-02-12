/**
 * File: /src/env.ts
 * Description: Environment configuration and validation
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-10
 */

// Zod is not available, so we'll implement basic validation ourselves
const requiredServerEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "NODE_ENV",
] as const;

const requiredClientEnvVars = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APP_ENV",
] as const;

type ServerEnvVars = (typeof requiredServerEnvVars)[number];
type ClientEnvVars = (typeof requiredClientEnvVars)[number];

// Validate server-side environment variables
function validateServerEnv(): Record<ServerEnvVars, string> {
  const missingVars = requiredServerEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required server environment variables: ${missingVars.join(", ")}`
    );
  }

  return requiredServerEnvVars.reduce(
    (acc, envVar) => ({
      ...acc,
      [envVar]: process.env[envVar] as string,
    }),
    {} as Record<ServerEnvVars, string>
  );
}

// Validate client-side environment variables
function validateClientEnv(): Record<ClientEnvVars, string> {
  const missingVars = requiredClientEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required client environment variables: ${missingVars.join(", ")}`
    );
  }

  return requiredClientEnvVars.reduce(
    (acc, envVar) => ({
      ...acc,
      [envVar]: process.env[envVar] as string,
    }),
    {} as Record<ClientEnvVars, string>
  );
}

// Environment configuration object
export const env = {
  server: validateServerEnv(),
  client: validateClientEnv(),
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};

// Example .env.development file content as a comment for reference:
/*
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chores_dev"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-key"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_ENV="development"
*/
