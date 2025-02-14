---
file: /docs/FILE_STRUCTURE.md
description: Listing of entire directory structure
project: Household Chore Gamification System
lastModified: 2025-02-13
---

# Project File structure

## Command

`:r! rg --files`

## Output

```txt
README.md
package.json
scripts/verify-dev-env.sh
Dockerfile
src/__tests__/middleware/user-validation-middleware.test.ts
next.config.ts
package-lock.json
eslint.config.mjs
src/__tests__/__mocks__/next/server.ts
docker-compose.yml
src/__tests__/auth/verification-token.test.ts
src/__tests__/auth/oauth-account-linking.test.ts
src/__tests__/auth/user-service.test.ts
src/__tests__/auth/user-creation.test.ts
src/app/layout.tsx
src/app/page.tsx
public/window.svg
public/vercel.svg
public/globe.svg
public/file.svg
public/next.svg
tailwind.config.ts
tsconfig.json
jest.setup.ts
src/types/index.ts
src/types/auth-test.ts
src/components/ui/button.tsx
docs/FILE_STRUCTURE.md
src/components/features/chore-card.tsx
src/env.ts
src/lib/utils.ts
src/app/favicon.ico
src/app/globals.css
src/app/api/auth/[...nextauth]/route.ts
docs/database/MIGRATION_STRATEGY.md
src/utils/test/auth-test-utils.ts
jest.config.js
postcss.config.mjs
docs/auth/AUTHENTICATION_REQUIREMENTS.md
docs/auth/AUTH_USER_STORIES.md
docs/auth/AUTH_FLOWS.md
docs/planning/PHASE_1_IMPLEMENTATION.md
docs/planning/PDR.md
prisma/schema.prisma
prisma/seed.ts
docs/style/STYLE_GUIDE.md
src/lib/services/auth/user-service.ts
prisma/migrations/migration_lock.toml
prisma/seeds/auth-test-seed.ts
prisma/migrations/20250212141538_init_auth_and_gamification/migration.sql
prisma/migrations/20250212183331_add_user_password_field/migration.sql
prisma/__tests__/schema.test.ts
docs/testing/AUTH_TEST_SPECS.md
src/lib/middleware/user-validation.ts
```
