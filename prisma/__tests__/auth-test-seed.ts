/**
 * File: /prisma/__tests__/seed/auth-test-seed.ts
 * Description: Test data seeding for authentication tests
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function seedAuthTestData() {
  // Clear existing auth-related data
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create test users with different auth scenarios
  const hashedPassword = await hash("TestPassword123!", 10);

  // Verified user with password
  const verifiedUser = await prisma.user.create({
    data: {
      name: "Verified User",
      email: "verified@example.com",
      emailVerified: new Date(),
    },
  });

  // Unverified user with password
  const unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified User",
      email: "unverified@example.com",
      emailVerified: null,
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
    verifiedUser,
    unverifiedUser,
    oauthUser,
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
