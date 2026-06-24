# App Flow

## Entry point

`main.dart` bootstraps the DI container then runs `StaretzApp`. The app uses `go_router` (to be added) for routing. Each route maps to a container widget that wires a Cubit to a dumb widget tree.

## Request flow

```
User action
  → Container widget dispatches event / calls Cubit method
    → Cubit calls Read or Write service (application layer)
      → Service calls repository port (domain abstract class)
        → Infrastructure adapter fulfils the port
          → Result flows back as domain object
            → Cubit emits new state
              → Dumb widget rebuilds via BlocBuilder
```

## Pages (planned)

| Route | Container | Description |
|-------|-----------|-------------|
| `/` | `HomeContainer` | Landing page |
| `/posts` | `PostListContainer` | All posts |
| `/posts/:slug` | `PostDetailContainer` | Single post |

## Data flow for posts

Posts are Markdown files under `lib/blog/infrastructure/posts/`. They are loaded at startup via `import.meta`-style asset loading, parsed into domain `Post` entities by the infrastructure layer, and exposed to the presentation layer as read-only state through the `PostStateService` Cubit.

## Update cycle

1. A new Markdown file is added to the posts directory.
2. On next hot restart the `PostRepository` adapter picks it up.
3. No backend, no API call — the app is fully static.
