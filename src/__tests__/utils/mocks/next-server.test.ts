/**
 * File: /src/__tests__/utils/mocks/next-server.test.ts
 * Description: Tests for Next.js server component mocks
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-15
 */

import { NextResponse, NextRequest } from "./next-server";

describe("NextResponse Mock", () => {
  it("should create response with default status", async () => {
    const data = { message: "test" };
    const response = new NextResponse(data);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(data);
  });

  it("should create response with custom status", async () => {
    const data = { error: "not found" };
    const response = new NextResponse(data, { status: 404 });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual(data);
  });

  it("should create response using static json method", async () => {
    const data = { success: true };
    const response = NextResponse.json(data, { status: 201 });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(data);
  });
});

describe("NextRequest Mock", () => {
  it("should create request with provided URL", () => {
    const url = "http://localhost/api/test";
    const request = new NextRequest(url);

    expect(request.url).toBe(url);
    expect(request.nextUrl.toString()).toBe(url);
  });

  it("should parse JSON body when provided", async () => {
    const body = { key: "value" };
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const parsedBody = await request.json();
    expect(parsedBody).toEqual(body);
  });

  it("should handle empty body", async () => {
    const request = new NextRequest("http://localhost");

    const parsedBody = await request.json();
    expect(parsedBody).toEqual({});
  });

  it("should include default properties", () => {
    const request = new NextRequest("http://localhost");

    expect(request.cookies).toBeInstanceOf(Map);
    expect(request.page).toEqual({ name: "test" });
    expect(request.ua.isBot).toBe(false);
  });
});
