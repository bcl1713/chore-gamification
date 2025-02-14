/**
 * File: /src/__tests__/auth/user-service.test.ts
 * Description: Tests for user service functionality
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UserService } from "../../lib/services/auth/user-service";
import bcrypt from "bcrypt";
import { MockUserWithPassword } from "../../types/auth-test";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

describe("UserService", () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let userService: UserService;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    mockReset(prisma);
    userService = new UserService(prisma);
  });

  describe("createUser", () => {
    const validUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
    };

    it("should set correct default values for new users", async () => {
      prisma.user.create.mockResolvedValue({
        id: "1",
        ...validUserData,
        password: expect.any(String),
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.createUser(validUserData);

      expect(result.success).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: validUserData.name,
          email: validUserData.email,
          points: 0,
          level: 1,
          isHouseholdAdmin: false,
        }),
        select: expect.any(Object),
      });
    });

    it("should create a user successfully with valid data", async () => {
      prisma.user.create.mockResolvedValue({
        id: "1",
        ...validUserData,
        password: expect.any(String),
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.createUser(validUserData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(validUserData.email);
      expect(result.user?.name).toBe(validUserData.name);
      expect(result.error).toBeUndefined();

      // Verify password was hashed
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: expect.not.stringContaining(validUserData.password),
          }),
        })
      );
    });

    it("should reject invalid email formats", async () => {
      const invalidEmails = [
        "not-an-email",
        "@nodomain",
        "no@domain",
        "spaces in@email.com",
        "",
      ];

      for (const email of invalidEmails) {
        const result = await userService.createUser({
          ...validUserData,
          email,
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe("INVALID_EMAIL");
        expect(prisma.user.create).not.toHaveBeenCalled();
      }
    });

    it("should enforce password requirements", async () => {
      const invalidPasswords = [
        { password: "short" },
        { password: "nouppercasenum1!" },
        { password: "NOLOWERCASENUM1!" },
        { password: "NoSpecialChar1" },
        { password: "NoNumber!" },
      ];

      for (const { password } of invalidPasswords) {
        const result = await userService.createUser({
          ...validUserData,
          password,
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe("INVALID_PASSWORD");
        expect(result.error?.message).toBeDefined();
        expect(prisma.user.create).not.toHaveBeenCalled();
      }
    });

    it("should prevent duplicate emails", async () => {
      prisma.user.create.mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`email`)")
      );

      const result = await userService.createUser(validUserData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("EMAIL_EXISTS");
      expect(result.user).toBeUndefined();
    });
  });

  describe("verifyPassword", () => {
    const email = "test@example.com";
    const password = "Password123!";

    it("should verify correct password successfully", async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies MockUserWithPassword);

      const result = await userService.verifyPassword(email, password);
      expect(result).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies MockUserWithPassword);

      const result = await userService.verifyPassword(email, "wrongpassword");
      expect(result).toBe(false);
    });

    it("should handle non-existent user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await userService.verifyPassword(email, password);
      expect(result).toBe(false);
    });

    it("should handle user without password (OAuth user)", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
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
      } satisfies MockUserWithPassword);

      const result = await userService.verifyPassword(email, password);
      expect(result).toBe(false);
    });
  });
});
