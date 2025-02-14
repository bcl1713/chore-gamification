/**
 * File: /src/lib/services/auth/user-service.ts
 * Description: User management and authentication service
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { MockOAuthData } from "@/utils/test/auth-test-utils";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: {
    code:
      | "INVALID_EMAIL"
      | "INVALID_PASSWORD"
      | "EMAIL_EXISTS"
      | "SERVER_ERROR";
    message: string;
  };
}

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    if (password.length < 8) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[\d]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  async createFromOAuth(oauthData: MockOAuthData): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: oauthData.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: oauthData.email,
          name: oauthData.name,
          emailVerified: new Date(),
          points: 0,
          level: 1,
          isHouseholdAdmin: false,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: oauthData.provider,
          providerAccountId: oauthData.providerAccountId,
        },
      });

      return user;
    });
  }

  async createUser(input: CreateUserInput): Promise<CreateUserResponse> {
    if (!this.validateEmail(input.email)) {
      return {
        success: false,
        error: {
          code: "INVALID_EMAIL",
          message: "Invalid email format",
        },
      };
    }

    if (!this.validatePassword(input.password)) {
      return {
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message:
            "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
        },
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          points: 0,
          level: 1,
          isHouseholdAdmin: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return {
        success: true,
        user,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return {
          success: false,
          error: {
            code: "EMAIL_EXISTS",
            message: "Email already exists",
          },
        };
      }
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });

    if (!user?.password) return false;

    return bcrypt.compare(password, user.password);
  }
}
