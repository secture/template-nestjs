## CI/CD Workflows

### Workflows Overview

1. **Run Tests**: Executes unit tests on each push to `dev` and `main`.
2. **Validate PR**: Lints and tests pull requests to `dev` and `main`.
3. **Release**: Automatically creates new versions using Semantic Release.

### Key Tools

- **GitHub Actions**: Manages CI/CD workflows.
- **Semantic Release**: Automates versioning and changelog generation.
