/**
 * File: /src/__tests__/utils/auth-test-utils.tsx
 * Description: Test utilities for authentication testing
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { render } from "@testing-library/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export interface MockSessionUser {
  id: string;
  name: string;
  email: string;
  householdId?: string;
  isHouseholdAdmin?: boolean;
}

export const createMockSession = (
  userData: Partial<MockSessionUser> = {}
): Session => ({
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    householdId: undefined,
    isHouseholdAdmin: false,
    ...userData,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
});

const Providers = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => <SessionProvider session={session}>{children}</SessionProvider>;

export const renderWithAuth = (ui: ReactNode, { session = null } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers session={session}>{children}</Providers>
    ),
  });
};

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  route: "/",
  pathname: "/",
  query: {},
  asPath: "/",
};

export const createMockUser = (overrides: Partial<MockSessionUser> = {}) => ({
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  emailVerified: null,
  password: null,
  image: null,
  householdId: null,
  isHouseholdAdmin: false,
  points: 0,
  level: 1,
  ...overrides,
});
