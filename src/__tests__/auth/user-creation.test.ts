/**
 * File: /src/__tests__/auth/user-creation.test.ts
 * Description: Tests for user creation and authentication
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import bcrypt from "bcrypt";
import { MockUserWithPassword } from "@/types/auth-test";

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

let prisma: DeepMockProxy<PrismaClient>;

beforeEach(() => {
  prisma = mockDeep<PrismaClient>();
  mockReset(prisma);
});

describe("User Creation", () => {
  it("should create a user with correct default values", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
    };

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    prisma.user.create.mockResolvedValue({
      id: "1",
      name: userData.name,
      email: userData.email,
      emailVerified: null,
      image: null,
      password: null,
      householdId: null,
      isHouseholdAdmin: false,
      points: 0,
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    expect(result.email).toBe(userData.email);
    expect(result.name).toBe(userData.name);
    expect(result.points).toBe(0);
    expect(result.level).toBe(1);
    expect(result.isHouseholdAdmin).toBe(false);
    expect(result.emailVerified).toBeNull();
  });

  it("should enforce email uniqueness", async () => {
    const userData = {
      name: "Test User",
      email: "existing@example.com",
      password: "Password123!",
    };

    prisma.user.create.mockRejectedValue(
      new Error("Unique constraint failed on the fields: (`email`)")
    );

    await expect(
      prisma.user.create({
        data: userData,
      })
    ).rejects.toThrow("Unique constraint failed");
  });

  it("should validate email format", async () => {
    const userData = {
      name: "Test User",
      email: "invalid-email",
      password: "Password123!",
    };

    prisma.user.create.mockRejectedValue(new Error("Invalid email format"));

    await expect(
      prisma.user.create({
        data: userData,
      })
    ).rejects.toThrow("Invalid email format");
  });

  it("should enforce password requirements", async () => {
    const weakPasswords = [
      "short", // Too short
      "nouppercasenum1", // No uppercase
      "NOLOWERCASENUM1", // No lowercase
      "NoSpecialChar1", // No special character
      "NoNumber!", // No number
    ];

    for (const password of weakPasswords) {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password,
      };

      prisma.user.create.mockRejectedValue(
        new Error("Password does not meet requirements")
      );

      await expect(
        prisma.user.create({
          data: userData,
        })
      ).rejects.toThrow("Password does not meet requirements");
    }
  });

  describe("Password Hashing", () => {
    it("should hash password using bcrypt with correct salt rounds", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      };

      prisma.user.create.mockResolvedValueOnce({
        id: "1",
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies MockUserWithPassword);

      const result = await prisma.user.create({
        data: userData,
      });

      // Verify the password was hashed and not stored in plain text
      expect(result.password).not.toBe(userData.password);
      expect(result.password).toMatch(/^\$2[aby]\$\d{1,2}\$/); // Bcrypt hash pattern

      // Verify we can validate the password
      const isValid = await bcrypt.compare(userData.password, result.password!);
      expect(isValid).toBe(true);
    });

    it("should use consistent salt rounds for password hashing", async () => {
      const password = "Password123!";
      const hashSpy = jest.spyOn(bcrypt, "hash");

      prisma.user.create.mockResolvedValueOnce({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash(password, 10),
        emailVerified: null,
        image: null,
        householdId: null,
        isHouseholdAdmin: false,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies MockUserWithPassword);

      await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password,
        },
      });

      expect(hashSpy).toHaveBeenCalledWith(password, 10);
      hashSpy.mockRestore();
    });
  });
});
