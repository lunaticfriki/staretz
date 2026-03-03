# Project Conventions & Architecture

This document outlines the architectural decisions, coding standards, and best practices for the `staretz` Flutter project. AI assistants and developers should refer to this document to understand the project's structure and rules.

## 1. Architecture: Domain-Driven Design (DDD) / Hexagonal
The application strictly follows a Hexagonal Architecture (Ports and Adapters) combined with Domain-Driven Design principles.
The `lib/` directory is divided into the following main layers:
- **`domain/`**: Contains the core business logic, entities, value objects, and repository interfaces (ports). This layer has NO dependencies on any external packages (like Flutter UI or Firebase).
  - **Constructors**: Entities and Value Objects should use private constructors.
  - **Factories**: Use static factory methods like `create()` for instantiation and `empty()` for default/empty states.
- **`infrastructure/`**: Contains the implementations of the domain interfaces (adapters). This includes external service integrations (e.g., Firebase, local storage, API clients).
- **`application/`** (or `app/`): Contains the application logic and state management. We use `flutter_bloc` (Cubits) here to orchestrate use cases.
- **`presentation/`**: Contains the Flutter UI code (`screens/` and `widgets/`). 

## 2. State Management & Dependency Injection
- **State Management**: We use `flutter_bloc` (specifically `Cubit`). Cubits reside in the `application/` layer.
- **Dependency Injection**: We use `get_it` coupled with `injectable` for dependency injection. The initialization happens in `lib/core/di/injection.dart`.

## 3. Configuration & Hardcoded Values
We avoid "magic strings" and hardcoded values scattered throughout the codebase.
- **Constants**: All asset paths, configuration values, and non-UI constants are stored in `lib/config/constants.dart` under the `AppConstants` class.
- **Translations/UI Strings**: All user-facing text and UI strings are stored in `lib/config/translations.dart` under the `AppTranslations` class.

## 4. Theming & Styling
The app supports both Light and Dark modes.
- **Theme Definition**: Themes are defined in `lib/core/theme/app_theme.dart`.
- **Colors**: The primary color is Purple, and the secondary/accent color is Yellow. The dark theme uses a true black background.
- **Typography**: The app uses the "Inconsolata" font via the `google_fonts` package.
- **Components**: The header (`BlogHeader`) and footer (`BlogFooter`) are extracted as reusable widgets and adapt to the current theme.

## 5. Testing
- Object Mothers and Data Builders are used to create test data.
- Domain logic must be heavily unit-tested.

## 6. Code Style & Formatting
- **No Comments**: Remove or avoid using inline code comments (`//` or `/* */`). Code should be self-documenting and expressive enough that external comments explaining the logic are not needed.
