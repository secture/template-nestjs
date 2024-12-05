# Version Control Middleware

## Overview
The version control middleware validates the client’s API version against the minimum supported and recommended versions. It ensures compatibility and provides guidance for updating clients.

## Configuration
Add the following variables to your `.env` file:

```bash
MIN_SUPPORTED_VERSION=1.0.0
RECOMMENDED_VERSION=2.0.0
```

## Behavior

1. **With `x-app-version` header**:
    - If the version is below the minimum supported version (`MIN_SUPPORTED_VERSION`), the middleware responds with `HTTP 403 Forbidden`.
    - Otherwise, the request proceeds, and the recommended version (`RECOMMENDED_VERSION`) is included in the response headers.

2. **Without `x-app-version` header**:
    - The request proceeds, and the recommended version is included in the response headers.

## Example
### Request
```http
GET /example-endpoint HTTP/1.1
Host: localhost:3000
x-app-version: 1.0.0
```

### Response
```http
HTTP/1.1 200 OK
x-recommend-version: 2.0.0
```

## Testing
Ensure that the middleware behaves as expected:
- Requests with valid versions proceed.
- Requests with outdated versions return `403 Forbidden`.
- Requests without the version header proceed but include `x-recommend-version`.
