# Contributing to Rentroo

Thank you for your interest in contributing to Rentroo! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/rentroo.git
   cd rentroo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add password reset functionality`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update installation steps`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes and commit
3. Push to your fork
4. Open a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes

## Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Run `npm run lint` before committing
- Run `npm run test` to ensure tests pass

## Reporting Issues

- Use GitHub Issues for bug reports
- Include steps to reproduce
- Include expected vs actual behavior
- Include environment details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
