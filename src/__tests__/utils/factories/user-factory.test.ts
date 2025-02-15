/**
 * File: /src/__tests__/utils/factories/user-factory.test.ts
 * Description: Tests for user factory functions
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import bcrypt from "bcrypt";
import {
  createMockUser,
  createMockUserWithPassword,
  createMockOAuthUser,
  createMockVerifiedUser,
} from "./user-factory";

describe("User Factory", () => {
  describe("createMockUser", () => {
    it("should create user with default values", () => {
      const user = createMockUser();

      expect(user.id).toBeDefined();
      expect(user.name).toBe("Test User");
      expect(user.email).toMatch(/^test-\d+@example\.com$/);
      expect(user.emailVerified).toBeNull();
      expect(user.password).toBeNull();
      expect(user.isHouseholdAdmin).toBe(false);
      expect(user.points).toBe(0);
      expect(user.level).toBe(1);
    });

    it("should override default values", () => {
      const overrides = {
        name: "Custom Name",
        email: "custom@example.com",
        isHouseholdAdmin: true,
      };

      const user = createMockUser(overrides);

      expect(user.name).toBe(overrides.name);
      expect(user.email).toBe(overrides.email);
      expect(user.isHouseholdAdmin).toBe(overrides.isHouseholdAdmin);
    });

    it("should hash password when provided", () => {
      const password = "TestPass123!";
      const user = createMockUser({ password });

      expect(user.password).not.toBe(password);
      expect(bcrypt.compareSync(password, user.password!)).toBe(true);
    });
  });

  describe("createMockUserWithPassword", () => {
    it("should create user with hashed password", () => {
      const password = "TestPass123!";
      const user = createMockUserWithPassword(password);

      expect(user.password).not.toBe(password);
      expect(bcrypt.compareSync(password, user.password!)).toBe(true);
    });

    it("should apply overrides with password", () => {
      const password = "TestPass123!";
      const overrides = {
        name: "Custom Name",
        email: "custom@example.com",
      };

      const user = createMockUserWithPassword(password, overrides);

      expect(user.name).toBe(overrides.name);
      expect(user.email).toBe(overrides.email);
      expect(bcrypt.compareSync(password, user.password!)).toBe(true);
    });
  });

  describe("createMockOAuthUser", () => {
    it("should create OAuth user data", () => {
      const input = {
        provider: "google",
        providerAccountId: "123456",
        email: "oauth@example.com",
        name: "OAuth User",
      };

      const userData = createMockOAuthUser(input);

      expect(userData.name).toBe(input.name);
      expect(userData.email).toBe(input.email);
      expect(userData.emailVerified).toBeInstanceOf(Date);
      expect(userData.accounts?.create).toEqual(
        expect.objectContaining({
          provider: input.provider,
          providerAccountId: input.providerAccountId,
          type: "oauth",
        })
      );
    });
  });

  describe("createMockVerifiedUser", () => {
    it("should create user with verified email", () => {
      const user = createMockVerifiedUser();

      expect(user.emailVerified).toBeInstanceOf(Date);
    });

    it("should apply overrides with verified email", () => {
      const overrides = {
        name: "Verified User",
        email: "verified@example.com",
      };

      const user = createMockVerifiedUser(overrides);

      expect(user.name).toBe(overrides.name);
      expect(user.email).toBe(overrides.email);
      expect(user.emailVerified).toBeInstanceOf(Date);
    });
  });
});
