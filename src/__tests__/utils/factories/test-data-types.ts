/**
 * File: /src/__tests__/utils/factories/test-data-types.ts
 * Description: Type definitions for test data factories
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import { User, Prisma } from "@prisma/client";

export type MockUserInput = Pick<User, "name" | "email"> & {
  password?: string;
  isHouseholdAdmin?: boolean;
  emailVerified?: Date | null;
};

export type MockUserWithPassword = User & {
  password: string | null;
};

export type MockOAuthInput = {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
};

export type MockVerificationTokenInput = {
  identifier: string;
  expiresInHours?: number;
};

// Ensure our mocks match Prisma's expected types
export type PrismaUserCreateInput = Prisma.UserCreateInput;

// Override Prisma's VerificationToken type to ensure Date for expires
export type PrismaVerificationTokenCreateInput = Omit<
  Prisma.VerificationTokenCreateInput,
  "expires"
> & {
  expires: Date;
};
