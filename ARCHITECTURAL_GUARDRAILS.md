# Architectural Guardrails

> **Purpose:** Define non-negotiable architectural constraints for the Rentroo monorepo. All contributors and AI agents must adhere to these guardrails.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | v20 |
| **Language** | TypeScript | 5.5.4 |
| **Package Manager** | Yarn (Workspaces) | 3.3.0 |
| **Monorepo Structure** | Yarn Workspaces | - |
| **Database** | MongoDB | - |
| **Containerization** | Docker + Docker Compose | - |
| **Linting** | ESLint | - |
| **Formatting** | Prettier | 3.5.2 |
| **Git Hooks** | Husky + lint-staged | 9.1.7 / 15.4.3 |
| **E2E Testing** | Cypress | - |
| **Desktop App** | Tauri / Electron | - |
| **CI/CD** | GitHub Actions | - |
| **Deployment** | Docker Compose, Northflank, Render, Railway | - |

---

## Monorepo Structure

```
rentroo/
├── cli/                    # CLI tool for dev/prod orchestration
├── e2e/                    # End-to-end tests (Cypress)
├── services/               # Backend microservices
│   └── */                  # Each service is a workspace
├── webapps/                # Frontend web applications
│   └── */                  # Each webapp is a workspace
├── types/                  # Shared TypeScript type definitions
├── desktop-app/            # Desktop application (Tauri/Electron)
├── config/                 # Shared configuration files
├── scripts/                # Build/deploy automation scripts
├── terraform/              # Infrastructure as Code
└── documentation/          # Project documentation
```

### Workspace Rules

1. **Every workspace MUST have its own `package.json`** with a scoped `@rentroo/*` name.
2. **Shared types MUST live in `types/`** — never duplicate type definitions across services/webapps.
3. **Services MUST NOT import from webapps** and vice versa. Communication is via API contracts defined in `types/`.
4. **CLI is the single entry point** for dev/prod orchestration (`yarn dev`, `yarn start`, `yarn stop`).

---

## Architectural Principles

### 1. Separation of Concerns

- **Frontend (webapps/)** handles UI, state management, and user interactions.
- **Backend (services/)** handles business logic, data persistence, and API contracts.
- **Shared (types/)** contains only TypeScript interfaces, enums, and constants — zero implementation logic.

### 2. API-First Design

- All inter-service and client-server communication MUST be defined via explicit contracts in `types/`.
- No implicit data shapes. Every API request/response MUST have a corresponding TypeScript interface.

### 3. Database Isolation

- Each service owns its data. No cross-service database queries.
- MongoDB is the primary datastore. Connection strings MUST come from environment variables — never hardcoded.

### 4. Configuration Management

- All secrets and configuration MUST be managed via `.env` files.
- Never commit `.env` files with real secrets. Use `.env.example` as templates.
- Environment variables MUST be validated at application startup.

### 5. Security

- **No secrets in code or commits.** Use `.env` files and CI/CD secret management.
- **Input validation** on all API endpoints.
- **CORS** must be explicitly configured — never use wildcard `*` in production.
- **Dependencies** must be audited regularly (`yarn audit`).

---

## Code Standards

### TypeScript

- **Strict mode enabled** — no `any` types allowed.
- **No implicit returns** — all functions must have explicit return types.
- **Use `interface` for public contracts**, `type` for unions/intersections.

### Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| Files | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Functions | camelCase | `getUserById` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Interfaces | PascalCase (prefixed with `I` only if ambiguous) | `User`, `IConfig` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `perf`

---

## Testing Requirements

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Unit | Jest / Vitest | 80%+ |
| Integration | Supertest | Critical paths |
| E2E | Cypress | User journeys |

- All new features MUST include tests.
- PRs MUST pass all CI checks before merge.

---

## Deployment Guardrails

1. **Docker images MUST be multi-stage builds** — minimize image size.
2. **Health checks** MUST be defined for all services.
3. **Graceful shutdown** — all services must handle SIGTERM.
4. **Zero-downtime deployments** — use rolling updates where possible.
5. **Database migrations** MUST be backward compatible.

---

## Decision Records

All significant architectural decisions MUST be documented as Architecture Decision Records (ADRs) in `docs/adr/`.

See [ADR Template](./docs/adr/TEMPLATE.md) for the format.

---

## System Architecture

See [C4 System Context Diagram](./docs/architecture/diagrams/system-context.mmd) for the high-level system architecture.

---

## Enforcement

- **Pre-commit hooks** (Husky + lint-staged) enforce formatting and linting.
- **CI pipeline** runs lint, type-check, test, and build.
- **PR reviews** enforce architectural compliance.
- **AI agents** MUST load this file before making any code changes.

---

*Last updated: 2026-04-05*
