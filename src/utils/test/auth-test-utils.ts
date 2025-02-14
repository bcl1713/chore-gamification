/**
 * File: /src/__tests__/utils/auth-test-utils.ts
 * Description: Test utilities for authentication testing
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  householdId: string | null;
  isHouseholdAdmin: boolean;
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export const createMockUser = (
  overrides: Partial<MockUser> = {}
): MockUser => ({
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  password: null,
  emailVerified: null,
  image: null,
  householdId: null,
  isHouseholdAdmin: false,
  points: 0,
  level: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export interface MockOAuthData {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
}

export const createMockOAuthUser = ({
  provider,
  providerAccountId,
  email,
  name,
}: MockOAuthData) => ({
  provider,
  providerAccountId,
  email,
  name,
});
