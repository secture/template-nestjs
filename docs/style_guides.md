# Backend Style Guide

This document defines the coding conventions and best practices for the API backend. Following this guide ensures consistency and readability across the codebase.

---

## General Principles

1. **Readability**: Write code that is easy to read and understand.
2. **Consistency**: Stick to the project's defined conventions.
3. **Simplicity**: Avoid over-engineering or premature optimization.
4. **Documentation**: Add meaningful comments where necessary, especially for complex logic.

---

## Naming Conventions

### Variables and Constants

- Use `camelCase` for variables and functions.

```typescript
const userName = 'John Doe';
```

- Use `UPPER_CASE` for constants.

```typescript
const API_URL = 'https://api.eleve.com';
```

### Classes and Interfaces

- Use `PascalCase` for class and interface names.

```typescript
class UserService {}
interface UserDTO {}
```

### Files and Folders

- Use `kebab-case` for file and folder names.

```plaintext
user.service.ts
logging.config.ts
```

---

## Code Formatting

- **Indentation**: Use 2 spaces for indentation.
- **Line Length**: Keep lines under 80 characters where possible.
- **Braces**: Always use braces for control structures.

```typescript
if (condition) {
// Do something
}
```

---

## TypeScript Best Practices

1. Always use **strict typing**.

```typescript
const age: number = 25;
```

2. Prefer **interfaces** over type aliases for object shapes.

```typescript
interface User {
name: string;
age: number;
}
```

3. Use `readonly` for immutable properties.

```typescript
interface Config {
readonly apiUrl: string;
}
```

4. Use `enum` sparingly and prefer union types for simple cases.

```typescript
type Role = 'admin' | 'user' | 'guest';
```

---

## Project Structure Guidelines

1. Follow the **Hexagonal Architecture** structure as defined in the [Project Structure Guide](./project-structure.md).
2. Separate concerns into appropriate layers: `application`, `domain`, `infrastructure`, `presentation`.

---

## Testing

1. Write tests for:
    - Critical business logic.
    - Utility functions.
    - API endpoints.
2. Use `describe` and `it` blocks for clear test organization.

```typescript
describe('UserService', () => {
it('should create a user', () => {
// Test implementation
});
});
```

---

## Linting and Formatting

1. Run `npm run lint` to check for style issues.
2. Use `npm run format` to auto-format the codebase.
3. Configure your editor to use the project's `.editorconfig` settings.

---

This guide will be expanded as the project evolves. If you have suggestions or changes, please discuss them with the team.
