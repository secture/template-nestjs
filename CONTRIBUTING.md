# Contributing to Eleve API

Thank you for taking the time to contribute to Eleve API. This document outlines the guidelines and best practices for
contributing to the project.

---

## 📦 Setting up the Development Environment

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

## ✨ Commit Guidelines

We follow Conventional Commits to ensure consistency and automation for versioning and changelog generation.

### Commit Message Format

A commit message should be structured as follows:

```plaintext
<type>(optional scope): <description>
[optional body]
[optional footer(s)]
```

### Common Types

- feat: A new feature.
- fix: A bug fix.
- docs: Documentation-only changes.
- style: Code style changes (formatting, missing semicolons, etc.) that do not affect functionality.
- refactor: Code refactoring without changing functionality.
- test: Adding or updating tests.
- chore: Maintenance tasks (e.g., updating build scripts or dependencies).

### Examples

- feat(auth): add login endpoint
- fix(db): resolve connection timeout issue
- docs(readme): update installation instructions

### Tip

Use the following command to create a commit interactively:

 ```bash
 npm run commit
 ```

This will guide you through the process of formatting your commit message correctly.

---

## 🌿 Branch Naming Conventions

Branches should follow this naming pattern:

```plaintext
<type>/<task-id>-<short-description>
```

### Common Types

- feature: For new features.
- fix: For bug fixes.
- chore: For maintenance tasks.
- hotfix: For critical fixes that need immediate deployment.

### Examples

- feature/1234-add-authentication
- fix/5678-correct-login-error
- chore/91011-update-dependencies

---

## 🛠️ Development Workflow

1. Create a branch:

    ```bash
    git checkout -b <type>/<task-id>-<short-description>
    ```

2. Commit changes following the guidelines above.
3. Push your branch:

    ```bash
    git push origin <branch-name>
    ```

4. Open a Pull Request:
    - Use the [Pull Request Template](.github/pull_request_template.md).
    - Ensure your code passes all checks (tests, linting, etc.).
    - Add meaningful comments to explain your changes if necessary.

### Testing the Healthcheck

After setting up the development environment, verify the healthcheck endpoint:

```bash
curl http://localhost:3000/health
```

### Swagger Integration

Swagger is integrated into the project. All routes must be documented.

- Use decorators like `@ApiTags`, `@ApiOperation`, and `@ApiResponse` in controllers.
- Access the documentation at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

---

## ✅ Code Quality Checklist

Before submitting your changes, ensure the following:

- Code follows the project’s style guidelines.
- Tests have been added or updated to cover new changes.
- The project builds successfully.
- Documentation is updated if necessary.
- No new warnings or errors are introduced.

---

## 📝 Additional Notes

- For more details on our CI/CD processes, refer to [docs/ci_cd.md](docs/ci_cd.md).
- Contact the project maintainer for questions or issues related to this guide.
