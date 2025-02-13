/**
 * File: /src/__tests__/__mocks__/next/server.ts
 * Description: Mock for Next.js server components
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

export const NextResponse = {
  json: (data: unknown) => ({
    status: 400,
    json: async () => data,
  }),
};

export const NextRequest = jest
  .fn()
  .mockImplementation((url: string, init?: RequestInit) => ({
    url,
    cookies: new Map(),
    nextUrl: new URL(url),
    page: { name: "test" },
    ua: { isBot: false },
    ...init,
  }));
