/**
 * File: /src/types/auth-test.ts
 * Description: Type definitions for authentication tests
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

export interface MockUserWithPassword {
  id: string;
  name: string;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  householdId: string | null;
  isHouseholdAdmin: boolean;
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}
