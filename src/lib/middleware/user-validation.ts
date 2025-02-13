/**
 * File: /src/lib/middleware/user-validation.ts
 * Description: Middleware for validating user input
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { UserRegistrationInput } from "@/types/auth-test";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function validateUserInput(
  request: NextRequest,
  next: (validatedBody: UserRegistrationInput) => Promise<void>
): Promise<NextResponse | undefined> {
  const body = (await request.json()) as UserRegistrationInput;

  if (body.email && !EMAIL_REGEX.test(body.email)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid email format",
        },
      },
      { status: 400 }
    );
  }

  const requiredFields = ["name", "email", "password"];
  const missingFields = requiredFields.filter(
    (field) => !body[field as keyof UserRegistrationInput]
  );

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
      },
      { status: 400 }
    );
  }

  await next(body);
  return undefined;
}
