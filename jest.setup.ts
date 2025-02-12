/**
 * File: /jest.setup.ts
 * Description: Jest setup file for test environment configuration
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
}));
