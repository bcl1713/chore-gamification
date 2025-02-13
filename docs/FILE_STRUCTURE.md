---
file: /docs/FILE_STRUCTURE.md
description: Listing of entire directory structure
project: Household Chore Gamification System
lastModified: 2025-02-12
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
src/__tests__/auth/verification-token.test.ts
src/__tests__/auth/user-service.test.ts
src/__tests__/auth/user-creation.test.ts
src/app/layout.tsx
src/app/page.tsx
src/app/api/auth/[...nextauth]/route.ts
src/app/globals.css
src/app/favicon.ico
src/utils/test/auth-test-utils.ts
src/types/index.ts
src/types/auth-test.ts
src/lib/utils.ts
src/lib/services/auth/user-service.ts
src/components/ui/button.tsx
src/components/features/chore-card.tsx
src/env.ts
docker-compose.yml
prisma/__tests__/schema.test.ts
prisma/seeds/auth-test-seed.ts
prisma/seed.ts
prisma/migrations/20250212183331_add_user_password_field/migration.sql
prisma/migrations/20250212141538_init_auth_and_gamification/migration.sql
prisma/migrations/migration_lock.toml
prisma/schema.prisma
next.config.ts
package-lock.json
eslint.config.mjs
jest.config.js
postcss.config.mjs
tsconfig.json
jest.setup.ts
tailwind.config.ts
public/window.svg
docs/FILE_STRUCTURE.md
public/vercel.svg
public/globe.svg
public/file.svg
public/next.svg
docs/testing/AUTH_TEST_SPECS.md
docs/planning/PHASE_1_IMPLEMENTATION.md
docs/planning/PDR.md
docs/auth/AUTH_USER_STORIES.md
docs/auth/AUTH_FLOWS.md
docs/auth/AUTHENTICATION_REQUIREMENTS.md
docs/style/STYLE_GUIDE.md
docs/database/MIGRATION_STRATEGY.md
```
