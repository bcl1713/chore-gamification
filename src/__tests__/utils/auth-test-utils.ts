/**
 * File: /src/__tests__/utils/auth-test-utils.ts
 * Description: Test utilities for authentication testing
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { ReactElement } from 'react';

// Mock session data types based on our schema
export interface MockSessionUser {
  id: string;
  name: string;
  email: string;
  householdId?: string;
  isHouseholdAdmin?: boolean;
}

export interface MockSession {
  user: MockSessionUser;
  expires: string;
}

// Helper to create a mock session
export const createMockSession = (userData: Partial<MockSessionUser> = {}): MockSession => ({
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    householdId: undefined,
    isHouseholdAdmin: false,
    ...userData,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
});

// Custom render with auth provider
export const renderWithAuth = (
  ui: ReactElement,
  { session = null, ...renderOptions } = {}
) => {
  const Wrapper = ({ children }: { children: ReactElement }) => (
    <SessionProvider session={session}>{children}</SessionProvider>
  );

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};

// Mock Next.js navigation
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
};

// Helper to create mock user data
export const createMockUser = (overrides: Partial<MockSessionUser> = {}) => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: null,
  image: null,
  householdId: null,
  isHouseholdAdmin: false,
  points: 0,
  level: 1,
  ...overrides,
});
