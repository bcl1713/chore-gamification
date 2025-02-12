---
file: /docs/database/MIGRATION_STRATEGY.md
description: Database migration strategy and procedures
project: Household Chore Gamification System
lastModified: 2025-02-12
---

# Database Migration Strategy

## Overview

This document outlines our approach to database migrations for the Household
Chore Gamification System.

## Tools and Setup

Our migration system leverages:

- Prisma ORM for schema management and migrations
- dotenv-cli for environment management
- PostgreSQL as the primary database

### Environment Configuration

- Development environment uses `.env.development`
- Prisma commands require dotenv-cli for environment variable loading

### Core Commands

```bash
# Run migrations
npm run prisma:migrate:dev -- --name <migration_name>

# Generate Prisma client
npm run prisma:generate

# View database with Prisma Studio
npm run prisma:studio
```

## Migration Principles

1. All schema changes must be made through migrations
2. Migrations must be reversible
3. Breaking changes require incremental migrations
4. Data integrity must be maintained throughout migrations
5. All migrations must be tested in development before staging/production

## Development Process

### Creating Migrations

```bash
npm run prisma:migrate:dev -- --name <migration_name>
```

### Testing Migrations

```bash
dotenv -e .env.development -- npx prisma migrate reset
```

### Verification Steps

- Verify data integrity
- Verify schema correctness
- Run application tests

## Production Process

### Database Backup

```bash
pg_dump -U <username> -d <database> > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Deployment

```bash
npx prisma migrate deploy
```

### Status Verification

```bash
npx prisma migrate status
```

## Rollback Procedures

### Development Environment

To reset to a specific migration:

```bash
dotenv -e .env.development -- npx prisma migrate reset --to <migration_name>
```

### Production Environment

1. Restore from backup:

   ```bash
   psql -U <username> -d <database> < backup_file.sql
   ```

2. Roll back to specific migration:

   ```bash
   npx prisma migrate reset --to <migration_name>
   ```

## Monitoring and Validation

- Monitor migration execution time
- Verify data integrity post-migration
- Check application functionality
- Review logs for any errors or warnings

## Current Migrations

### init_auth_and_gamification

- Description: Initial schema setup with auth and basic gamification models
- Type: Create tables
- Reversible: Yes
- Tables Affected:
  - User
  - Account
  - Session
  - VerificationToken
  - Household
  - Chore
  - ChoreCompletion
  - Achievement
  - UserAchievement

## Future Planning

1. Add indexes for performance optimization
2. Add additional gamification features
3. Implement point history tracking
4. Add chore scheduling system

## Testing Strategy

- Unit tests for each migration
- Integration tests for related features
- Data integrity verification
- Performance impact assessment

## Change History

- 2025-02-12: Initial document creation
- 2025-02-12: Added dotenv-cli configuration and updated commands
