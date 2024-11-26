# Eleve API

@TODO: add project description

## 📖 Table of Contents

1. [Features](#-features)
2. [Installation](#-installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
3. [Available Scripts](#-available-scripts)
4. [Documentation](#-documentation)
    - [Swagger](#swagger)
    - [Project Structure](#project-structure)
    - [Guides](#guides)
5. [CI/CD and Releases](#-cicd-and-releases)
6. [Contributions](#-contributions)
7. [License](#-license)

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

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22.
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-private-repo/eleve-api.git
   cd eleve-api
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

### Project Structure

```plaintext
src/
├── app.module.ts          # Root module of the project.
├── main.ts                # Application entry point.
├── controllers/           # API controllers.
├── services/              # Business logic services.
└── entities/              # Database entities definition.
```

### Guides

- [Pull Request Guide](docs/pull_requests.md): Checklist and best practices for submitting changes.
- [Style Guide](docs/style_guides/backend.md): Backend coding conventions.
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

## 🤝 Contributions

This is a private project. Contributions are managed internally by the team.

- See our [Contributing Guide](CONTRIBUTING.md) for detailed instructions and guidelines.

---

## 📜 License

This project is private and unlicensed.
