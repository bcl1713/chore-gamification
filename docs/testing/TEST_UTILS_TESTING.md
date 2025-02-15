---
file: /docs/testing/TEST_UTILS_TESTING.md
description: Strategy for testing test utilities and helpers
project: Household Chore Gamification System
lastModified: 2025-02-15
---

# Testing Test Utilities

## Organization

Test utilities and their tests are co-located within the **tests**/utils
directory:

```txt
src/__tests__/utils/
├── factories/           # Data factories and their tests
│   ├── test-data-types.ts
│   ├── test-data-types.test.ts
│   ├── user-factory.ts
│   └── user-factory.test.ts
├── mocks/              # Mock implementations and their tests
│   ├── next-server.ts
│   └── next-server.test.ts
└── setup/             # Test setup utilities and their tests
    ├── prisma-test-context.ts
    └── prisma-test-context.test.ts
```

## Rationale

- Test utilities are test-only code
- Never built/deployed
- Co-location provides clear relationship
- Makes it obvious if tests are missing
- Simplifies relative imports

## What to Test

### Test Data Factories

- Validation of generated test data
- Consistency of default values
- Proper type enforcement
- Correct handling of overrides

### Mock Utilities

- Correct implementation of mock interfaces
- Proper reset/cleanup functionality
- Expected behavior of mock methods

### Test Setup Utilities

- Correct initialization of test contexts
- Proper cleanup after tests
- Error handling in setup/teardown

## What Not to Test

- Simple object creation without logic
- Direct pass-through mock implementations
- Framework-provided utilities
- Basic type definitions

## Implementation Example

```typescript
// src/__tests__/utils/factories/user-factory.test.ts
import {
  createMockUser,
  createMockUserWithPassword,
} from "@/utils/test/factories/user-factory";
import { User } from "@prisma/client";

describe("User Factory", () => {
  describe("createMockUser", () => {
    it("should create user with valid defaults", () => {
      const user = createMockUser();

      // Test required fields
      expect(user.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
      expect(user.name).toBeDefined();

      // Test default values
      expect(user.points).toBe(0);
      expect(user.level).toBe(1);
      expect(user.isHouseholdAdmin).toBe(false);
    });

    it("should properly override defaults", () => {
      const override = {
        name: "Custom Name",
        points: 100,
        level: 5,
      };

      const user = createMockUser(override);
      expect(user.name).toBe(override.name);
      expect(user.points).toBe(override.points);
      expect(user.level).toBe(override.level);
    });
  });
});

// src/__tests__/utils/setup/prisma-test-context.test.ts
import {
  setupTestContext,
  resetTestContext,
} from "@/utils/test/setup/prisma-test-context";

describe("Prisma Test Context", () => {
  it("should create valid test context", () => {
    const context = setupTestContext();

    expect(context.prisma).toBeDefined();
    expect(context.userService).toBeDefined();
    expect(typeof context.prisma.$connect).toBe("function");
  });

  it("should properly clean up resources", async () => {
    const context = setupTestContext();
    const spy = jest.spyOn(context.prisma, "$disconnect");

    await resetTestContext(context);
    expect(spy).toHaveBeenCalled();
  });
});
```

## Guidelines

1. Keep utility tests simple

   - Focus on correctness of output
   - Verify essential behavior only
   - Don't test implementation details

2. Test maintainability impacts

   - Each utility test adds maintenance overhead
   - Only test complex or critical utilities
   - Document test utility behavior well

3. Use clear patterns

   - Consistent naming conventions
   - Standard test organization
   - Clear separation of concerns

4. Consider test impact

   - Test utilities should be stable
   - Changes should be backwards compatible
   - Document breaking changes clearly

5. Focus areas:
   - Data validation
   - Error handling
   - Resource cleanup
   - Type correctness
