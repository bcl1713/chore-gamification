/**
 * File: /jest.config.ts
 * Description: Jest test runner configuration
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;
