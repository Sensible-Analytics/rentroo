# Architecture Guidelines

## NestJS/Backend Structure

```
src/
├── modules/        # Feature modules
├── controllers/   # HTTP handlers
├── services/      # Business logic
├── repositories/  # Data access
├── dto/           # Data transfer objects
├── guards/        # Auth guards
└── common/        # Shared utilities
```

## Dependency Rules

- Controllers → Services → Repositories
- No business logic in controllers
- Use DTOs for validation
- Guards for authentication

## Naming Conventions

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Repositories: `*.repository.ts`
- DTOs: `*.dto.ts`

## Code Size Limits

- **Max 200 lines per file** (warn at 200, error at 300)
- **Max 30 lines per function** (warn at 30, error at 50)
- **Complexity ≤ 8** (warn), ≤ 10 (error)
- **Max nesting depth ≤ 4**
- **Max 3 parameters per function**

If code exceeds these limits, REFACTOR immediately using Extract Method, Extract Class, or other patterns.

## Before Generating Code

1. Identify feature module
2. Create service first, then controller
3. Use DTOs for input validation
4. Keep files under 200 lines, functions under 30 lines
5. Run: `npm run lint` before commit