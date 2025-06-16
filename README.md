# Template NestJS

@TODO: add project description

## 📖 Table of Contents

1. [Features](#-features)
2. [How to Use This Template](#-how-to-use-this-template)
3. [Installation](#-installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
4. [Available Scripts](#-available-scripts)
5. [Documentation](#-documentation)
    - [Swagger](#swagger)
    - [Healthcheck](#healthcheck)
    - [Project Structure](#project-structure)
    - [Error Handling](#error-handling)
    - [Guides](#guides)
6. [CI/CD and Releases](#-cicd-and-releases)
7. [Logging System](#-logging-system)
8. [Contributions](#-contributions)
9. [License](#-license)

---

## 🚀 Features

- **Framework**: Modular NestJS structure.
- **Documentation**: Interactive API documentation via Swagger.
- **Database**: PostgreSQL managed with MikroORM.
- **Automation**: CI/CD pipelines configured using GitHub Actions.
- **Releases**: Automated versioning and changelog management with Semantic Release.
- **Developer Tools**:
  - ESLint, Prettier, Husky, Commitlint.
  - Renovate for dependency updates.

---

## 🧩 How to Use This Template

You can create a new project based on this template in two ways:

### 🖱️ From the GitHub UI

1. Go to the [template repository](https://github.com/secture/template-nestjs)
2. Click the green `Use this template` button
3. Choose your new repository name and settings
4. Click `Create repository`

### 🧑‍💻 From the CLI using GitHub CLI

If you have the [GitHub CLI](https://cli.github.com/) installed, you can run:

```bash
gh repo create your-new-repo-name --internal --template secture/template-nestjs
   ```

---

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22.
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

### Steps

1. Clone the repository:

   ```bash
   git clone git@github.com:tineverse/eleve-base.git
   cd eleve-base
   ```

2. Create the .env file:
   Copy the provided `.env.example` template to `.env`:

   ```bash
   cp .env.example .env
   ```

   Update the variables in the .env file as needed.
3. Start the services with Docker:

   ```bash
   make start
   ```

4. Install dependencies:

   ```bash
   make install
   ```

5. Access the Swagger documentation:  
   <http://localhost:3000/api/docs>

---

## 🛠️ Available Scripts

### Development

- `npm run start:dev`: Start the server in development mode.

### Linting and Formatting

- `npm run lint`: Run ESLint to check for style errors.
- `npm run format`: Use Prettier to format the code.

### Testing

- `npm run test`: Run unit tests.
- `npm run test:cov`: Generate a coverage report.

### Releases

- `npm run release`: Generate a new version with Semantic Release.

### Version Control

- `npm run commit`: Helps create commit messages following Conventional Commits.

---

## 📚 Documentation

### Swagger

The API documentation is available at:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

#### Global Headers

- **x-correlation-id**: Correlation identifier for tracing related requests.
  - **Type**: `string`
  - **Required**: `false`
  - **Scope**: Request headers

#### Version Middleware

The API includes a middleware to ensure client compatibility based on the API version.
For more details, see the [Version Control Guide](docs/version-control.md).

### Healthcheck

The healthcheck endpoint provides information about the application's status, including:

- **Database Connection**: Verifies if the database is reachable.
- **Swagger Availability**: Ensures the API documentation endpoint is accessible.

Endpoint: [http://localhost:3000/health](http://localhost:3000/health)

### Project Structure

```
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

### Error Handling

The API uses a centralized error handling system. All exceptions from the domain layer are transformed into HTTP exceptions and logged for observability.

#### Key Features

- **Domain Exceptions**: Exceptions from the domain are mapped to HTTP exceptions using the `DomainToHttpExceptionMapper`.
- **Logging**: All exceptions are logged, including their stack trace, status, and response details.

#### Example Mappings

- `NotFoundException` → `404 Not Found`
- `ValidationException` → `400 Bad Request`

Refer to the [Error Handling Guide](docs/error-handling.md) for more details.

### Guides

- [Pull Request Guide](docs/pull_requests.md): Checklist and best practices for submitting changes.
- [Project Structure](docs/project-structure.md): Detailed project structure and architecture.
- [Swagger Documentation](docs/swagger.md): Configuration and usage of Swagger for API documentation.
- [Style Guide](docs/style_guides.md): Backend coding conventions.
- [CI/CD](docs/ci_cd.md): Description of pipelines and automation.

---

## 🚀 CI/CD and Releases

### Configured Workflows

- **Run Tests**: Executes tests on every push to `dev` and `main`.
- **Validate PR**: Validates Pull Requests in `dev` and `main`, including:
  - Linting (`lint-staged`).
  - Automated tests.
- **Release**: Creates new releases with Semantic Release.

### Automated Releases

Semantic Release manages versioning automatically:

1. Analyzes commit messages.
2. Generates a new version (`major`, `minor`, or `patch`).
3. Updates the changelog and creates a release on GitHub.

---

## 🛠️ Logging System

The API uses a structured logging system based on **Winston**. It provides:

- **Console Logs**: Pretty logs for development with colorized output.
- **File Logs**: Structured logs for error tracking and auditing.
- **Request Tracing**: Includes `Request ID` and `Correlation ID` for debugging distributed requests.

### Configuration

- Default log level: `debug`.
- Set the log level using the environment variable:

  ```bash
  LOG_LEVEL=info
  ```

For detailed documentation, see the [Logging System Guide](docs/logging.md).

## 🤝 Contributions

This is a private project. The team manages contributions internally.

- See our [Contributing Guide](CONTRIBUTING.md) for detailed instructions and guidelines.

---

## 📜 License

This project is private and unlicensed.
