# Staretz

A personal blog built with Flutter Web, following DDD and Hexagonal Architecture principles.

## About

Staretz is a content-focused blog. Posts are written in Markdown and stored locally in the project. The architecture enforces strict layer boundaries, keeping business logic in the domain and the framework at the edges.

## Documentation

- [App flow & features](docs/README.md)
- [Tech stack](docs/stack.md)
- [Architecture overview](docs/architecture/overview.md)
- [Domain layer](docs/architecture/domain.md)
- [Application layer](docs/architecture/application.md)
- [Infrastructure layer](docs/architecture/infrastructure.md)
- [Presentation layer](docs/architecture/presentation.md)
- [Dependency injection](docs/architecture/di.md)
- [Testing strategy](docs/architecture/testing.md)
- [Naming conventions](docs/architecture/naming.md)
- [Blog features](docs/functional/blog.md)

## Running

```bash
CHROME_EXECUTABLE=/usr/bin/brave-browser ~/development/flutter/bin/flutter run -d chrome
```

## Tests

```bash
flutter test                   # unit + arch tests
flutter test integration_test  # e2e tests
```
