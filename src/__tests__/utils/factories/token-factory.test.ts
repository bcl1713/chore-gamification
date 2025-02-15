/**
 * File: /src/__tests__/utils/factories/token-factory.test.ts
 * Description: Tests for verification token factory functions
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import {
  createMockVerificationToken,
  createMockExpiredToken,
  createMockTokenWithValue,
} from "./token-factory";

describe("Token Factory", () => {
  const testIdentifier = "test@example.com";

  describe("createMockVerificationToken", () => {
    it("should create token with default expiry", () => {
      const token = createMockVerificationToken({ identifier: testIdentifier });

      expect(token.identifier).toBe(testIdentifier);
      expect(token.token).toMatch(/^[a-f0-9]{64}$/); // 32 bytes = 64 hex chars
      expect(token.expires).toBeInstanceOf(Date);

      // Should expire in ~24 hours (allow 1 second test execution time)
      const expectedExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(
        Math.abs(token.expires.getTime() - expectedExpiry.getTime())
      ).toBeLessThan(1000);
    });

    it("should create token with custom expiry", () => {
      const expiryHours = 48;
      const token = createMockVerificationToken({
        identifier: testIdentifier,
        expiresInHours: expiryHours,
      });

      const expectedExpiry = new Date(
        Date.now() + expiryHours * 60 * 60 * 1000
      );
      expect(
        Math.abs(token.expires.getTime() - expectedExpiry.getTime())
      ).toBeLessThan(1000);
    });

    it("should create unique tokens for multiple calls", () => {
      const token1 = createMockVerificationToken({
        identifier: testIdentifier,
      });
      const token2 = createMockVerificationToken({
        identifier: testIdentifier,
      });

      expect(token1.token).not.toBe(token2.token);
    });
  });

  describe("createMockExpiredToken", () => {
    it("should create token that is already expired", () => {
      const token = createMockExpiredToken({ identifier: testIdentifier });

      expect(token.identifier).toBe(testIdentifier);
      expect(token.token).toMatch(/^[a-f0-9]{64}$/);
      expect(token.expires.getTime()).toBeLessThan(Date.now());
    });
  });

  describe("createMockTokenWithValue", () => {
    it("should create token with specified value", () => {
      const tokenValue = "specific_token_value";
      const token = createMockTokenWithValue({
        identifier: testIdentifier,
        tokenValue,
      });

      expect(token.identifier).toBe(testIdentifier);
      expect(token.token).toBe(tokenValue);
      expect(token.expires).toBeInstanceOf(Date);
    });

    it("should respect custom expiry", () => {
      const expiryHours = 12;
      const token = createMockTokenWithValue({
        identifier: testIdentifier,
        tokenValue: "test_token",
        expiresInHours: expiryHours,
      });

      const expectedExpiry = new Date(
        Date.now() + expiryHours * 60 * 60 * 1000
      );
      expect(
        Math.abs(token.expires.getTime() - expectedExpiry.getTime())
      ).toBeLessThan(1000);
    });
  });
});
