---
file: /docs/style/STYLE_GUIDE.md
description: Code and documentation style guide for the project
project: Household Chore Gamification System
lastModified: 2025-02-10
---

# Style Guide

## File Organization

### File Headers

Files must include appropriate header metadata based on their file type:

#### Markdown Files

Use YAML frontmatter:

```markdown
---
file: /path/to/file/filename.md
description: Brief description of the file's purpose
project: Household Chore Gamification System
lastModified: YYYY-MM-DD
---
```

#### JavaScript/TypeScript Files

Use JSDoc format:

```typescript
/**
 * File: /path/to/file/filename.ts
 * Description: Brief description of the file's purpose
 * Project: Household Chore Gamification System
 * Last Modified: YYYY-MM-DD
 */
```

#### CSS/SCSS Files

Use CSS comment format:

```css
/*
 * File: /path/to/file/filename.css
 * Description: Brief description of the file's purpose
 * Project: Household Chore Gamification System
 * Last Modified: YYYY-MM-DD
 */
```

#### Docker and Schema Files

Use hash comments:

```dockerfile
# File: /path/to/file/Dockerfile
# Description: Brief description of the file's purpose
# Project: Household Chore Gamification System
# Last Modified: YYY-MM-DD
```

### Directory Structure

```txt
src/
├── app/           # Next.js app router pages
├── components/    # React components
│   ├── ui/       # Reusable UI components
│   └── features/ # Feature-specific components
├── lib/          # Utility functions and shared logic
├── styles/       # Global styles and Tailwind configurations
└── types/        # TypeScript type definitions
```

## Code Style

### TypeScript

- Use explicit type annotations for function parameters and returns
- Prefer interfaces over type aliases for object definitions
- Use enums for fixed sets of values
- Enable strict mode in TypeScript configuration
- Use ES modules (`import`/`export`) instead of CommonJS
  (`require`/`module.exports`)
- Files should have the `.ts` or `.tsx` extension
- Configuration files (e.g., jest.config.js) should also use ES modules when
  possible

### React & Components

- Use functional components with hooks
- One component per file
- Component files should use PascalCase
- Utility files should use camelCase
- Test files should end with `.test.ts` or `.test.tsx`

### CSS & Styling

- Use Tailwind utility classes for styling
- Custom CSS should be minimal and placed in appropriate module files
- Follow BEM naming convention for any custom CSS classes

### Imports & Exports

- Use named exports for utilities and components
- Default exports only for page components
- Group imports in the following order:
  1. React and Next.js imports
  2. Third-party libraries
  3. Internal components
  4. Utilities and types
  5. Styles

### Comments & Documentation

- Use JSDoc comments for functions and components
- Include prop documentation for all components
- Comment complex logic or business rules
- Keep comments up to date with code changes

### Testing

- Test files should mirror the structure of source files
- Use descriptive test names following "given/when/then" pattern
- Mock external dependencies appropriately
- Include both unit and integration tests

## Git Practices

### Commit Messages

Follow conventional commits specification:

```ts
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build process or auxiliary tool changes

### Branches

- Use feature branches for new development
- Branch names should follow pattern: `type/description` Example:
  `feat/user-authentication`

## Code Quality

### Error Handling

- Use try/catch blocks for async operations
- Implement proper error boundaries
- Log errors appropriately
- Provide user-friendly error messages

### Performance

- Implement proper memoization using useMemo and useCallback
- Lazy load components when appropriate
- Optimize images and assets
- Monitor bundle size

### Security

- Sanitize user inputs
- Implement proper authentication checks
- Follow OWASP security guidelines
- Use environment variables for sensitive data

## Development Workflow

1. Create feature branch
2. Implement changes
3. Write/update tests
4. Run linting and type checking
5. Update documentation
6. Commit changes
7. Push and deploy

This guide should be treated as a living document and updated as new patterns
and best practices emerge during development.
