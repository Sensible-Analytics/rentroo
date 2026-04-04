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

## Before Generating Code

1. Identify feature module
2. Create service first, then controller
3. Use DTOs for input validation
4. Run: `npm run lint` before commit