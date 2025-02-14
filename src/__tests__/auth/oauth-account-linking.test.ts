/**
 * File: /src/__tests__/auth/oauth-account-linking.test.ts
 * Description: Tests for OAuth account linking functionality
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-14
 */

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { UserService } from "@/lib/services/auth/user-service";
import { createMockOAuthUser } from "@/utils/test/auth-test-utils";

describe("OAuth Account Linking", () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let userService: UserService;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    userService = new UserService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("New User Creation", () => {
    it("should create new user from OAuth data", async () => {
      // Arrange
      const oauthData = createMockOAuthUser({
        provider: "google",
        providerAccountId: "12345",
        email: "test@example.com",
        name: "Test User",
      });

      const mockUser = {
        id: "1",
        email: oauthData.email,
        name: oauthData.name,
        emailVerified: new Date(),
        image: null,
        points: 0,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: null,
        householdId: null,
        isHouseholdAdmin: false,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue(mockUser);

      // Act
      const result = await userService.createFromOAuth(oauthData);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(oauthData.email);
      expect(result).toEqual(mockUser);
    });
  });
});
