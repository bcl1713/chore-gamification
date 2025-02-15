/**
 * File: /src/__tests__/__mocks__/next/server.ts
 * Description: Mock for Next.js server components
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

export class NextResponse {
  public status: number;
  private responseData: unknown;

  constructor(data: unknown, init?: { status?: number }) {
    this.responseData = data;
    this.status = init?.status || 200;
  }

  async json() {
    return this.responseData;
  }

  static json(data: unknown, init?: { status?: number }) {
    return new NextResponse(data, init);
  }
}

export const NextRequest = jest
  .fn()
  .mockImplementation((url: string, init?: RequestInit) => ({
    url,
    cookies: new Map(),
    nextUrl: new URL(url),
    page: { name: "test" },
    ua: { isBot: false },
    json: async () => JSON.parse((init?.body as string) || "{}"),
    ...init,
  }));
