---
file: /docs/testing/TEST_REORGANIZATION.md
description: Test reorganization plan and checklist for auth functionality
project: Household Chore Gamification System
lastModified: 2025-02-14
---

# Test Reorganization Plan

## Directory Structure Changes

- [ ] Create new test directory structure

  ```txt
  src/__tests__/
  ├── unit/
  │   ├── auth/
  │   │   ├── user-service.test.ts      # Service layer unit tests
  │   │   ├── password-validation.test.ts
  │   │   └── token-generation.test.ts
  │   └── middleware/
  │       └── user-validation.test.ts
  └── integration/
      └── auth/
          ├── user-registration.test.ts
          ├── oauth-authentication.test.ts
          └── email-verification.test.ts
  ```

## Test Utility Organization and Testing

- [ ] Create centralized test utilities
- [ ] Add tests for complex test utilities

  - [ ] Create utils test directory
  - [ ] Test data factory validation
  - [ ] Mock utility correctness
  - [ ] Test context setup/teardown

  ```txt
  src/utils/test/
  ├── setup/
  │   └── prisma-test-context.ts
  ├── mocks/
  │   └── next-server.ts
  └── factories/
      ├── test-data-types.ts
      ├── user-factory.ts
      └── token-factory.ts
  ```

## File Migrations

### Unit Tests

- [ ] Split user-creation.test.ts
  - [ ] Move password validation logic to password-validation.test.ts
  - [ ] Remove database operation tests
- [ ] Split verification-token.test.ts
  - [ ] Move token generation logic to token-generation.test.ts
  - [ ] Remove database operation tests
- [ ] Keep user-validation-middleware.test.ts as is

### Integration Tests

- [ ] Create user-registration.test.ts
  - [ ] Migrate database tests from user-creation.test.ts
  - [ ] Add complete registration flow tests
- [ ] Rename oauth-account-linking.test.ts to oauth-authentication.test.ts
  - [ ] Move OAuth flow tests here
  - [ ] Expand OAuth integration coverage
- [ ] Create email-verification.test.ts
  - [ ] Move verification flow tests from verification-token.test.ts
  - [ ] Add complete verification flow tests

## Test Data Management

- [ ] Create factory functions for test data
  - [ ] User data factory
  - [ ] OAuth data factory
  - [ ] Token data factory
- [ ] Standardize mock implementations
  - [ ] Prisma client mocks
  - [ ] Next.js server mocks

## Documentation Updates

- [ ] Update AUTH_TEST_SPECS.md to reflect new organization
- [ ] Add test organization section to STYLE_GUIDE.md
- [ ] Update test-related sections in PDR.md

## Implementation Approach

1. Create new directories and utility files first
   - Include tests for complex utilities
   - Follow test utility testing guidelines
2. Implement one test category at a time:
   - Start with unit tests
   - Then integration tests
   - Finally shared utilities
3. Use git branches for each major change:
   - feature/test-utils-organization
   - feature/unit-test-reorganization
   - feature/integration-test-reorganization

## Success Criteria

- All existing test coverage maintained
- Clear separation between unit and integration tests
- Reduced code duplication in test setup
- Improved test maintainability
- Consistent testing patterns across files

## Notes

- Keep existing middleware separation
- Maintain current validation strategy at both HTTP and service layers
- Focus on organization without changing functionality
- All changes should be backwards compatible
