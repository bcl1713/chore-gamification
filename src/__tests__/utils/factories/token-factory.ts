/**
 * File: /src/__tests__/utils/factories/token-factory.ts
 * Description: Factory functions for creating test verification tokens
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import {
  MockVerificationTokenInput,
  PrismaVerificationTokenCreateInput,
} from "./test-data-types";
import crypto from "crypto";

/**
 * Creates a mock verification token with default or overridden values
 */
export function createMockVerificationToken(
  input: MockVerificationTokenInput
): PrismaVerificationTokenCreateInput {
  const expiresInHours = input.expiresInHours ?? 24; // Default 24 hour expiry

  return {
    identifier: input.identifier,
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
  };
}

/**
 * Creates an expired verification token for testing expiry scenarios
 */
export function createMockExpiredToken(
  input: MockVerificationTokenInput
): PrismaVerificationTokenCreateInput {
  return {
    identifier: input.identifier,
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() - 1000), // Expired 1 second ago
  };
}

/**
 * Creates a verification token with a specific token string
 * Useful for testing token validation
 */
export function createMockTokenWithValue(
  input: MockVerificationTokenInput & { tokenValue: string }
): PrismaVerificationTokenCreateInput {
  const expiresInHours = input.expiresInHours ?? 24;

  return {
    identifier: input.identifier,
    token: input.tokenValue,
    expires: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
  };
}
