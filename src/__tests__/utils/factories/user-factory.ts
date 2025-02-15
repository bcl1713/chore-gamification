/**
 * File: /src/__tests__/utils/factories/user-factory.ts
 * Description: Factory functions for creating test user data
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import {
  MockUserInput,
  MockUserWithPassword,
  MockOAuthInput,
  PrismaUserCreateInput,
} from "./test-data-types";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Creates a mock user with default or overridden values
 */
export function createMockUser(
  overrides: Partial<MockUserInput> = {}
): MockUserWithPassword {
  const defaultUser: MockUserWithPassword = {
    id: crypto.randomBytes(16).toString("hex"),
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    emailVerified: null,
    image: null,
    password: null,
    householdId: null,
    isHouseholdAdmin: false,
    points: 0,
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const passwordToHash = overrides.password;
  const finalOverrides = { ...overrides };

  if (passwordToHash) {
    delete finalOverrides.password;
    defaultUser.password = bcrypt.hashSync(passwordToHash, 10);
  }

  return {
    ...defaultUser,
    ...finalOverrides,
  };
}

/**
 * Creates a mock user with a hashed password
 */
export function createMockUserWithPassword(
  password: string,
  overrides: Partial<MockUserInput> = {}
): MockUserWithPassword {
  return createMockUser({
    password,
    ...overrides,
  });
}

/**
 * Creates mock OAuth user data
 */
export function createMockOAuthUser(
  input: MockOAuthInput
): PrismaUserCreateInput {
  return {
    name: input.name,
    email: input.email,
    emailVerified: new Date(),
    accounts: {
      create: {
        type: "oauth",
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        access_token: "mock_access_token",
        token_type: "Bearer",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        scope: "openid profile email",
      },
    },
  };
}

/**
 * Creates a verified user with default values
 */
export function createMockVerifiedUser(
  overrides: Partial<MockUserInput> = {}
): MockUserWithPassword {
  return createMockUser({
    emailVerified: new Date(),
    ...overrides,
  });
}
