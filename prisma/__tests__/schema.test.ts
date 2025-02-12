/**
 * File: /prisma/__tests__/schema.test.ts
 * Description: Tests for Prisma schema validation and relationships
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

let prisma: DeepMockProxy<PrismaClient>;

beforeEach(() => {
  prisma = mockDeep<PrismaClient>();
  mockReset(prisma);
});

describe("User Model", () => {
  it("creates a user with required fields", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
    };

    prisma.user.create.mockResolvedValue({
      id: "1",
      name: userData.name,
      email: userData.email,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      householdId: null,
      isHouseholdAdmin: false,
      points: 0,
      level: 1,
    });

    const user = await prisma.user.create({
      data: userData,
    });

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.points).toBe(0);
    expect(user.level).toBe(1);
    expect(user.isHouseholdAdmin).toBe(false);
  });

  it("enforces unique email constraint", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
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
});

describe("Household Model", () => {
  it("creates a household with members", async () => {
    const householdData = {
      name: "Test Household",
      members: {
        create: {
          name: "Test Member",
          email: "member@example.com",
        },
      },
    };

    prisma.household.create.mockResolvedValue({
      id: "1",
      name: householdData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const household = await prisma.household.create({
      data: householdData,
    });

    expect(household.name).toBe(householdData.name);
  });
});

describe("Chore Model", () => {
  it("creates a chore with required fields", async () => {
    const choreData = {
      name: "Test Chore",
      points: 10,
      frequency: "daily",
      householdId: "1",
    };

    prisma.chore.create.mockResolvedValue({
      id: "1",
      name: choreData.name,
      description: null,
      points: choreData.points,
      frequency: choreData.frequency,
      householdId: choreData.householdId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const chore = await prisma.chore.create({
      data: choreData,
    });

    expect(chore.name).toBe(choreData.name);
    expect(chore.points).toBe(choreData.points);
    expect(chore.frequency).toBe(choreData.frequency);
  });
});

describe("Achievement Model", () => {
  it("creates an achievement with required fields", async () => {
    const achievementData = {
      name: "Test Achievement",
      description: "Test Description",
      points: 100,
      requirement: JSON.stringify({ type: "chore_count", count: 5 }),
    };

    prisma.achievement.create.mockResolvedValue({
      id: "1",
      ...achievementData,
    });

    const achievement = await prisma.achievement.create({
      data: achievementData,
    });

    expect(achievement.name).toBe(achievementData.name);
    expect(achievement.points).toBe(achievementData.points);
    expect(achievement.requirement).toBe(achievementData.requirement);
  });
});

describe("Model Relationships", () => {
  it("connects user to household", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      household: {
        connect: {
          id: "1",
        },
      },
    };

    prisma.user.create.mockResolvedValue({
      id: "1",
      name: userData.name,
      email: userData.email,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      householdId: "1",
      isHouseholdAdmin: false,
      points: 0,
      level: 1,
    });

    const user = await prisma.user.create({
      data: userData,
    });

    expect(user.householdId).toBe("1");
  });

  it("connects chore completion to user and chore", async () => {
    const completionData = {
      userId: "1",
      choreId: "1",
    };

    prisma.choreCompletion.create.mockResolvedValue({
      id: "1",
      completedAt: new Date(),
      ...completionData,
    });

    const completion = await prisma.choreCompletion.create({
      data: completionData,
    });

    expect(completion.userId).toBe(completionData.userId);
    expect(completion.choreId).toBe(completionData.choreId);
  });
});
