# Staretz Flutter Blog Application

Welcome to the `staretz`! This is a modern, themeable blog application built from the ground-up focusing on scalable architecture and clean code principles.

## Architecture: Domain-Driven Design (DDD) / Hexagonal

The application strictly adheres to a Hexagonal Architecture (Ports and Adapters) fused with Domain-Driven Design (DDD) to ensure the core business logic remains independent of external frameworks (like Flutter or Firebase).

The source code (`lib/`) is structured into four primary layers:
- **`domain/`**: Houses the core business logic, entities, value objects, and repository interfaces (ports). 
  * *No external package dependencies map into this layer.*
  * Uses private constructors, relying on static factory methods (e.g., `create()`, `empty()`) for instantiation.
- **`infrastructure/`**: The adapters layer handling exact implementations of the domain interfaces (Firebase integrations, local storage, API clients).
- **`application/`** (or `app/`): Coordinates application logic and orchestrates usecases utilizing `flutter_bloc` (Cubits) for state management.
- **`presentation/`**: The Flutter UI code layer, containing all visual `screens/` and reusable `widgets/`.

## State Management & Dependency Injection

- **State Management**: Built on `flutter_bloc`, predominantly relying on `Cubit` to dispatch states efficiently.
- **Dependency Injection**: Powered by `get_it` and `injectable`. Environment initialization is strictly anchored at `lib/core/di/injection.dart`.

## Theming & Styling

This application natively supports fully dynamic Light and Dark modes.
- **Primary Color:** Purple
- **Secondary/Accent Color:** Yellow
- **Dark Mode:** Rendered completely in true black.
- **Typography:** Features the elegant "Inconsolata" font family (integrated via Google Fonts).
- Components like `BlogHeader` and `BlogFooter` dynamically adapt based on user theme selection.

All hardcoded values, including assets, text/translations, and UI strings, are strictly abstracted avoiding magic strings:
- **AppConstants:** Located at `lib/config/constants.dart`.
- **AppTranslations:** Located at `lib/config/translations.dart`.

## Getting Started & Scripts

For an optimal developer experience, you have access to various shortcut tasks orchestrated by a bash TMUX session.

### Running Dependencies locally
You can spin up the full development environment automatically utilizing the `Makefile`.

```bash
# Spins up the TMUX development console (Web Server + Tests + CLI Pane)
make dev 
```


*(Note: Run `./start_dev.sh` directly if you aren't integrating with `make`)*

## Testing Guidelines
- **Object Mothers & Data Builders** are widely leveraged to construct flexible test configurations.
- Focus heavily on comprehensive Unit Testing of the **Domain** tier mapping all functional paths.
s