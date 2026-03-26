# Agent Rules & Architecture Guidelines

This document specifies the practices and architecture that the agent must strictly follow when working on this project.

## 1. Architecture
- **DDD (Domain-Driven Design)**: Strictly follow Domain-Driven Design principles.
- **Hexagonal Architecture**: Use Ports and Adapters. The Domain layer must have no external dependencies. All external integrations belong in the Infrastructure layer.
- **Read and Write Services**: Separate read operations from write operations into distinct services or use cases following a CQRS-like pattern.

## 2. Coding Practices & Patterns
- **No Comments**: Do NOT add comments to the code. The code must be entirely self-documenting. Remove or avoid any inline (`//`) or block (`/* */`) comments.
- **Private Constructors**: Always use private constructors for domain Entities and Value Objects.
- **Factory Methods**: Instantiate objects using static factory methods (e.g., `create()`, `from()`, `empty()`).
- **Object Mothers**: Use the Object Mother pattern to generate data for testing rather than creating raw instances in test files.

## 3. State & Dependency Management
- **State**: Use appropriate state management (BLoC/Cubit) to orchestrate application logic and UI state.
- **Dependency Injection (DI)**: Use Dependency Injection for providing repositories, services, and state managers across the application.
