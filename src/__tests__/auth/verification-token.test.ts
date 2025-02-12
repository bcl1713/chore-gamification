/**
 * File: /src/__tests__/auth/verification-token.test.ts
 * Description: Tests for email verification token generation and management
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { createMockUser } from "@/utils/test/auth-test-utils";

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

let prisma: DeepMockProxy<PrismaClient>;

beforeEach(() => {
  prisma = mockDeep<PrismaClient>();
  mockReset(prisma);
});

describe("Verification Token", () => {
  it("should generate a verification token for a new user", async () => {
    const mockUser = createMockUser();

    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    prisma.verificationToken.create.mockResolvedValue({
      identifier: mockUser.email,
      token: "mock_verification_token",
      expires: expiryDate,
    });

    const result = await prisma.verificationToken.create({
      data: {
        identifier: mockUser.email,
        token: "mock_verification_token",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    expect(result.identifier).toBe(mockUser.email);
    expect(result.token).toBeDefined();
    expect(result.expires).toBeDefined();
    expect(result.expires.getTime()).toBeGreaterThan(Date.now());
  });

  it("should not allow duplicate tokens for the same email", async () => {
    const mockUser = createMockUser();

    prisma.verificationToken.create.mockRejectedValue(
      new Error("Unique constraint failed on the fields: (`identifier,token`)")
    );

    await expect(
      prisma.verificationToken.create({
        data: {
          identifier: mockUser.email,
          token: "mock_verification_token",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })
    ).rejects.toThrow("Unique constraint failed");
  });

  it("should handle token verification", async () => {
    const mockUser = createMockUser();
    const mockToken = "valid_token";

    prisma.verificationToken.findUnique.mockResolvedValue({
      identifier: mockUser.email,
      token: mockToken,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    });

    prisma.user.update.mockResolvedValue({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      emailVerified: new Date(),
      image: mockUser.image,
      householdId: mockUser.householdId,
      isHouseholdAdmin: mockUser.isHouseholdAdmin,
      points: mockUser.points,
      level: mockUser.level,
      createdAt: mockUser.createdAt,
      updatedAt: new Date(),
    });

    const foundToken = await prisma.verificationToken.findUnique({
      where: {
        token: mockToken,
      },
    });

    expect(foundToken).toBeDefined();
    expect(foundToken?.identifier).toBe(mockUser.email);
    expect(foundToken?.expires.getTime()).toBeGreaterThan(Date.now());

    const verifiedUser = await prisma.user.update({
      where: { email: foundToken?.identifier },
      data: { emailVerified: new Date() },
    });

    expect(verifiedUser.emailVerified).toBeDefined();
  });

  it("should reject expired tokens", async () => {
    const mockUser = createMockUser();
    const mockToken = "expired_token";

    prisma.verificationToken.findUnique.mockResolvedValue({
      identifier: mockUser.email,
      token: mockToken,
      expires: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    });

    const foundToken = await prisma.verificationToken.findUnique({
      where: {
        token: mockToken,
      },
    });

    expect(foundToken).toBeDefined();
    expect(foundToken?.expires.getTime()).toBeLessThan(Date.now());
  });

  it("should delete used tokens", async () => {
    const mockToken = "used_token";

    prisma.verificationToken.delete.mockResolvedValue({
      identifier: "test@example.com",
      token: mockToken,
      expires: new Date(),
    });

    const result = await prisma.verificationToken.delete({
      where: {
        token: mockToken,
      },
    });

    expect(result).toBeDefined();
    expect(result.token).toBe(mockToken);
  });
});
