# Project Structure

The API follows a **Hexagonal Architecture** pattern, separating business logic, application logic, and infrastructure concerns. Below is the detailed structure of the project:

```plaintext
src/
├── application/          # Application layer for use cases, commands, and queries
├── domain/               # Core business logic and domain models
│   ├── entities/         # Business entities (e.g., User)
│   ├── repositories/     # Interfaces for data access
│   └── value-objects/    # Immutable value objects (if needed in the future)
├── infrastructure/       # Infrastructure layer for external dependencies
│   ├── config/           # Configuration files (e.g., logging, database)
│   ├── interceptors/     # Custom interceptors
│   ├── logging/          # Centralized logging service
│   ├── middleware/       # HTTP middleware (e.g., request context)
│   └── repositories/     # Repository implementations (e.g., MikroORM)
├── presentation/         # Presentation layer for controllers and modules
│   ├── controllers/      # REST API controllers
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

### Key Layers

1. **Application Layer (`application/`)**
    - Contains business logic organized as **commands**, **queries**, and their respective **handlers**.
    - Provides use cases that act as orchestrators for domain services.

2. **Domain Layer (`domain/`)**
    - Includes core business entities, repositories (interfaces), and value objects.
    - Focuses on business rules and logic, remaining independent of any framework.

3. **Infrastructure Layer (`infrastructure/`)**
    - Implements external dependencies such as databases, middleware, and logging.
    - Provides concrete implementations of repository interfaces.

4. **Presentation Layer (`presentation/`)**
    - Handles user input and output via REST controllers.
    - Interfaces directly with the application layer.

5. **Main Entry Point**
    - The `main.ts` file bootstraps the application, initializing modules and middleware.

Refer back to the [README](../README.md) for additional details about the project.
