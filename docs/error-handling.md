# Error Handling Guide

This guide explains how exceptions are handled in the Eleve API.

---

## Overview

All exceptions in the system are either:

1. **Domain Exceptions**: Exceptions originating from the business logic.
2. **HTTP Exceptions**: Exceptions thrown directly by the API layer.

Domain exceptions are automatically transformed into HTTP exceptions using the `DomainToHttpExceptionMapper`.

---

## Example Mappings

### UserNotFoundException

- **Original Exception**:

  ```typescript
  throw new UserNotFoundException('User with ID 123 not found');
  ```

- **Mapped HTTP Response**:

  ```json
  {
  "statusCode": 404,
  "message": "User with ID 123 not found"
  }
  ```

### ValidationException

- **Original Exception**:

  ```typescript
  throw new ValidationException('Email is required');
  ```

- **Mapped HTTP Response**:

  ```json
  {
  "statusCode": 400,
  "message": "Email is required"
  }
  ```

---

## Customizing Mappings

To add new mappings, update the `DomainToHttpExceptionMapper` class located at:
`src/infrastructure/mappers/domain-to-http-exception.mapper.ts`.

Example:

```typescript
if (exception.name === 'NewCustomException') {
return new HttpException('Custom message', HttpStatus.UNPROCESSABLE_ENTITY);
}
```

---

## Logging

The following details are logged for each exception:

- **Status**: HTTP status code (e.g., 404, 500).
- **Message**: Exception message.
- **Stack Trace**: Full stack trace for debugging.

Logs are written to both the console and file:

- Console: Colorized output for development.
- File: Structured JSON logs for auditing.

---
