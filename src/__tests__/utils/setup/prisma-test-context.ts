/**
 * File: /src/__tests__/utils/setup/prisma-test-context.ts
 * Description: Test context setup utilities for Prisma
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { UserService } from "@/lib/services/auth/user-service";

export interface TestContext {
  prisma: DeepMockProxy<PrismaClient>;
  userService: UserService;
}

/**
 * Creates a mock test context with Prisma client and services
 */
export function setupTestContext(): TestContext {
  const prisma = mockDeep<PrismaClient>();
  const userService = new UserService(prisma);

  return {
    prisma,
    userService,
  };
}

/**
 * Resets all mocks in the test context
 */
export function resetTestContext(): void {
  jest.resetAllMocks();
}

/**
 * Cleans up test context resources
 */
export async function cleanupTestContext(context: TestContext): Promise<void> {
  await context.prisma.$disconnect();
}

/**
 * Wraps test operations in a transaction that will be rolled back
 */
export async function withTestTransaction<T>(
  context: TestContext,
  operation: (context: TestContext) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(context);
    return result;
  } finally {
    await context.prisma.$transaction([]); // Empty transaction to trigger rollback
  }
}
