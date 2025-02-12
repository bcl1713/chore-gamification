/**
 * File: /prisma/__tests__/seed/auth-test-seed.ts
 * Description: Test data seeding for authentication tests
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export interface TestUsers {
  verifiedUser: {
    id: string;
    email: string;
    password: string;
  };
  unverifiedUser: {
    id: string;
    email: string;
    password: string;
  };
  oauthUser: {
    id: string;
    email: string;
  };
}

export async function seedAuthTestData(): Promise<TestUsers> {
  // Clear existing auth-related data
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const testPassword = "TestPassword123!";
  const hashedPassword = await hash(testPassword, 10);

  // Verified user with password
  const verifiedUser = await prisma.user.create({
    data: {
      name: "Verified User",
      email: "verified@example.com",
      emailVerified: new Date(),
      // In a real app, we'd use a proper auth solution
      // This is just for testing purposes
      image: hashedPassword, // Store hashed password in image field temporarily
    },
  });

  // Unverified user with password
  const unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified User",
      email: "unverified@example.com",
      emailVerified: null,
      image: hashedPassword, // Store hashed password in image field temporarily
    },
  });

  // OAuth user
  const oauthUser = await prisma.user.create({
    data: {
      name: "OAuth User",
      email: "oauth@example.com",
      emailVerified: new Date(),
    },
  });

  // Create OAuth account link
  await prisma.account.create({
    data: {
      userId: oauthUser.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "google123",
      access_token: "mock_access_token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "Bearer",
      scope: "openid profile email",
    },
  });

  // Create active session
  await prisma.session.create({
    data: {
      userId: verifiedUser.id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      sessionToken: "mock_session_token",
    },
  });

  // Create verification token
  await prisma.verificationToken.create({
    data: {
      identifier: unverifiedUser.email,
      token: "mock_verification_token",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  return {
    verifiedUser: {
      id: verifiedUser.id,
      email: verifiedUser.email,
      password: testPassword,
    },
    unverifiedUser: {
      id: unverifiedUser.id,
      email: unverifiedUser.email,
      password: testPassword,
    },
    oauthUser: {
      id: oauthUser.id,
      email: oauthUser.email,
    },
  };
}

export async function cleanupAuthTestData() {
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
}

// Allow direct execution for development
if (require.main === module) {
  seedAuthTestData()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
