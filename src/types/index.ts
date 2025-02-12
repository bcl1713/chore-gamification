/**
 * File: /src/types/index.ts
 * Description: Core type definitions for the application
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-10
 */

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
