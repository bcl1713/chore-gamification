/**
 * File: /src/utils/test/__mocks__/next-server-mock.ts
 * Description: Mocks for Next.js server components testing
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-12
 */

export class NextRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === "string") {
      super(new URL(input).toString(), init);
    } else {
      super(input, init);
    }
  }
}

export class NextResponse extends Response {
  static json(data: any) {
    return new NextResponse(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  }
}
