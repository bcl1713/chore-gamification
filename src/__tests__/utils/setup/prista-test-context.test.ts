/**
 * File: /src/__tests__/utils/setup/prisma-test-context.test.ts
 * Description: Tests for Prisma test context utilities
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import {
  setupTestContext,
  resetTestContext,
  cleanupTestContext,
  withTestTransaction,
} from "./prisma-test-context";

describe("Prisma Test Context", () => {
  describe("setupTestContext", () => {
    it("should create context with required properties", () => {
      const context = setupTestContext();

      expect(context.prisma).toBeDefined();
      expect(context.userService).toBeDefined();
      expect(typeof context.prisma.$connect).toBe("function");
      expect(typeof context.prisma.$disconnect).toBe("function");
    });

    it("should create new mock instances for each call", () => {
      const context1 = setupTestContext();
      const context2 = setupTestContext();

      expect(context1.prisma).not.toBe(context2.prisma);
      expect(context1.userService).not.toBe(context2.userService);
    });
  });

  describe("resetTestContext", () => {
    it("should reset all mocks", () => {
      const context = setupTestContext();

      // Set up some mock calls
      context.prisma.user.findMany.mockResolvedValueOnce([]);
      context.prisma.user.findMany();

      // Verify mock was called
      expect(context.prisma.user.findMany).toHaveBeenCalled();

      // Reset mocks
      resetTestContext();

      // Verify mock calls were reset
      expect(context.prisma.user.findMany).not.toHaveBeenCalled();
    });
  });

  describe("cleanupTestContext", () => {
    it("should disconnect prisma client", async () => {
      const context = setupTestContext();
      const disconnectSpy = jest.spyOn(context.prisma, "$disconnect");

      await cleanupTestContext(context);

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe("withTestTransaction", () => {
    it("should execute operation within transaction", async () => {
      const context = setupTestContext();
      const operation = async (ctx: typeof context) => {
        await ctx.prisma.user.findMany();
        return "test result";
      };
      const transactionSpy = jest.spyOn(context.prisma, "$transaction");

      const result = await withTestTransaction(context, operation);

      expect(result).toBe("test result");
      expect(transactionSpy).toHaveBeenCalled();
    });

    it("should handle operation errors", async () => {
      const context = setupTestContext();
      const error = new Error("Test error");
      const operation = async () => {
        throw error;
      };

      await expect(withTestTransaction(context, operation)).rejects.toThrow(
        error
      );
    });

    it("should always attempt transaction rollback", async () => {
      const context = setupTestContext();
      const operation = async () => {
        throw new Error("Test error");
      };
      const transactionSpy = jest.spyOn(context.prisma, "$transaction");

      try {
        await withTestTransaction(context, operation);
      } catch (_error) {
        // Intentionally swallow error - we only care about transaction behavior
      }

      expect(transactionSpy).toHaveBeenCalled();
    });
  });
});
