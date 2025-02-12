/**
 * File: /prisma/seed.ts
 * Description: Database seeding script for development and testing
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.choreCompletion.deleteMany();
  await prisma.chore.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.household.deleteMany();

  // Create test household
  const testHousehold = await prisma.household.create({
    data: {
      name: "Test Family Household",
    },
  });

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      isHouseholdAdmin: true,
      householdId: testHousehold.id,
    },
  });

  // Create common household chores
  const chores = await Promise.all([
    prisma.chore.create({
      data: {
        name: "Do Dishes",
        description: "Load/unload dishwasher or hand wash dishes",
        points: 10,
        frequency: "daily",
        householdId: testHousehold.id,
      },
    }),
    prisma.chore.create({
      data: {
        name: "Vacuum Living Room",
        description: "Vacuum the main living room area",
        points: 15,
        frequency: "weekly",
        householdId: testHousehold.id,
      },
    }),
    prisma.chore.create({
      data: {
        name: "Take Out Trash",
        description: "Empty all trash bins and take to outdoor container",
        points: 5,
        frequency: "daily",
        householdId: testHousehold.id,
      },
    }),
  ]);

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "First Chore",
        description: "Complete your first chore",
        points: 50,
        requirement: JSON.stringify({ type: "chore_count", count: 1 }),
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Weekly Warrior",
        description: "Complete all weekly chores",
        points: 100,
        requirement: JSON.stringify({ type: "weekly_completion", count: 1 }),
      },
    }),
  ]);

  // Create some sample chore completions
  await Promise.all([
    prisma.choreCompletion.create({
      data: {
        choreId: chores[0].id,
        userId: testUser.id,
        completedAt: new Date(),
      },
    }),
    prisma.choreCompletion.create({
      data: {
        choreId: chores[1].id,
        userId: testUser.id,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
    }),
  ]);

  // Award initial achievement
  await prisma.userAchievement.create({
    data: {
      userId: testUser.id,
      achievementId: achievements[0].id,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
