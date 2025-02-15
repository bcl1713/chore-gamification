/**
 * File: /src/__tests__/utils/factories/test-data-types.test.ts
 * Description: Type validation tests for test data types
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import {
  MockUserInput,
  MockUserWithPassword,
  MockOAuthInput,
  MockVerificationTokenInput,
} from "./test-data-types";

describe("Test Data Types", () => {
  it("should validate MockUserInput structure", () => {
    const validInput: MockUserInput = {
      name: "Test User",
      email: "test@example.com",
      password: "optional_password",
      isHouseholdAdmin: true,
    };

    // TypeScript compilation validates the type
    expect(validInput.name).toBeDefined();
    expect(validInput.email).toBeDefined();
    expect(typeof validInput.password).toBe("string");
    expect(typeof validInput.isHouseholdAdmin).toBe("boolean");
  });

  it("should validate MockUserWithPassword structure", () => {
    const validUser: MockUserWithPassword = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      emailVerified: null,
      image: null,
      password: "hashed_password",
      householdId: null,
      isHouseholdAdmin: false,
      points: 0,
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate required User properties are present
    expect(validUser.id).toBeDefined();
    expect(validUser.email).toBeDefined();
    expect(validUser.password).toBeDefined();
  });

  it("should validate MockOAuthInput structure", () => {
    const validOAuthInput: MockOAuthInput = {
      provider: "google",
      providerAccountId: "123",
      email: "test@example.com",
      name: "Test User",
    };

    expect(validOAuthInput.provider).toBeDefined();
    expect(validOAuthInput.providerAccountId).toBeDefined();
    expect(validOAuthInput.email).toBeDefined();
    expect(validOAuthInput.name).toBeDefined();
  });

  it("should validate MockVerificationTokenInput structure", () => {
    const validTokenInput: MockVerificationTokenInput = {
      identifier: "test@example.com",
      expiresInHours: 24,
    };

    expect(validTokenInput.identifier).toBeDefined();
    expect(typeof validTokenInput.expiresInHours).toBe("number");
  });
});
