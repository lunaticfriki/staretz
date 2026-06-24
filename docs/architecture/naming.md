# Naming Conventions

## Files

| Artefact | Suffix | Example |
|----------|--------|---------|
| Entity | `<name>.dart` | `post.dart` |
| Value object | `<entity>_<field>.dart` | `post_title.dart` |
| Repository port | `<entity>_repository.dart` | `post_repository.dart` |
| Read service | `<entity>.read_service.dart` | `post.read_service.dart` |
| Write service | `<entity>.write_service.dart` | `post.write_service.dart` |
| State service (Cubit) | `<entity>.state_service.dart` | `post.state_service.dart` |
| State class | `<entity>_state.dart` | `post_state.dart` |
| Repository adapter | `<impl>_<entity>_repository.dart` | `markdown_post_repository.dart` |
| Dumb widget | `<name>.dart` | `post_list.dart`, `post_card.dart` |
| Container | `<name>.container.dart` | `post_list.container.dart` |
| Mother | `<entity>.mother.dart` | `post.mother.dart` |
| Arch test | `<subject>_arch_test.dart` | `blog_arch_test.dart` |
| E2E test | `<subject>_test.dart` in `integration_test/` | `home_test.dart` |

## Classes

| Artefact | Convention | Example |
|----------|-----------|---------|
| Entity | `PascalCase` | `Post` |
| Value object | `PascalCase` | `PostTitle` |
| Repository port | `PascalCase + Repository` | `PostRepository` |
| Read service | `PascalCase + ReadService` | `PostReadService` |
| Write service | `PascalCase + WriteService` | `PostWriteService` |
| State service | `PascalCase + StateService` | `PostStateService` |
| State class | `PascalCase + State` | `PostState` |
| Repository adapter | `PascalCase + Repository` (impl) | `MarkdownPostRepository` |
| Container | `PascalCase + Container` | `PostListContainer` |
| Mother | `PascalCase + Mother` | `PostMother` |
| Mock (generated) | `Mock + PascalCase` | `MockPostRepository` |

## Directories

```
lib/<feature>/domain/
lib/<feature>/application/
lib/<feature>/infrastructure/
lib/<feature>/presentation/
lib/shared/
lib/di/
test/arch/
test/<feature>/
test/mothers/<feature>/
integration_test/
```

## Arch test enforcement

The naming rules above are verified by arch tests in `test/arch/`. Any file that violates a suffix rule will fail CI.
