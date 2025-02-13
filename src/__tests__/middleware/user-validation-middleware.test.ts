/***
 * File: /src/__tests__/middleware/user-validation-middleware.test.ts
 * Description: Tests for user input validation middleware
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

import { NextRequest, NextResponse } from "next/server";
import { validateUserInput } from "@/lib/middleware/user-validation";
import { UserRegistrationInput } from "@/types/auth-test";

jest.mock("next/server");

describe("User Validation Middleware", () => {
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: UserRegistrationInput): NextRequest => {
    return new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  it("should pass valid user input", async () => {
    const validInput = {
      name: "Test User",
      email: "test@example.com",
      password: "ValidP@ss123",
    };

    const request = createRequest(validInput);
    const response = await validateUserInput(request, mockNext);

    expect(response).toBeUndefined();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("should reject missing required fields", async () => {
    const invalidInput = {
      email: "test@example.com",
      // missing name and password
    };

    const request = createRequest(invalidInput);
    const response = await validateUserInput(request, mockNext);

    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await (response as NextResponse).json();
    expect(response?.status).toBe(400);
    expect(responseJson()).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Missing required fields: name, password",
      },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should reject invalid email format", async () => {
    const invalidInput = {
      name: "Test User",
      email: "invalid-email",
      password: "ValidP@ss123",
    };

    const request = createRequest(invalidInput);
    const response = await validateUserInput(request, mockNext);

    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await (response as NextResponse).json();
    expect(response?.status).toBe(400);
    expect(responseJson()).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid email format",
      },
    });
  });

  it("should sanitize and trim input fields", async () => {
    const unsanitizedInput = {
      name: " Test User ",
      email: " test@example.com ",
      password: "ValidP@ss123",
    };

    const request = createRequest(unsanitizedInput);
    await validateUserInput(request, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test User",
        email: "test@example.com",
        password: "ValidP@ss123",
      })
    );
  });
});
