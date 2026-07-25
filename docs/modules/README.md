# Application Modules

The docs one level up ([../](../README.md)) are general architecture
reference — reusable across projects. These are not: they document
*this application's* actual modules as they exist today — what each one's
domain model is, which files implement which layer, and where to look
first when working on it. When code and these docs disagree, the code is
right; update the doc in the same change that changes the code (see the
root [README's non-negotiables](../README.md#non-negotiables-summary)).

- [about.md](about.md) — the About page. The minimal case: presentation
  only, no domain/application/infrastructure, because it has no dynamic
  data.
- [blog.md](blog.md) — the blog. The full four-layer example: `Post`
  entity, `PostCollection`, markdown-backed repository with an ACL, CQRS
  queries, read/state services, containers/components/skeletons.
- [shared-theme.md](shared-theme.md) — light/dark theme, `shared/theme/`.
- [shared-notifications.md](shared-notifications.md) — toast
  notifications, `shared/notifications/`.
- [shared-errors.md](shared-errors.md) — `DomainError`/`DomainWarning` and
  `ErrorManager`, `shared/errors/`.
- [shared-pagination.md](shared-pagination.md) — the criteria/result
  pagination primitive, `shared/pagination/`.
- [shared-search.md](shared-search.md) — the `SearchCriteria` filtering
  primitive, `shared/search/`.

Every module/shared-concern doc follows the same shape: what it's for,
its routes (if any), its domain model, its application layer, its
infrastructure adapter(s), its presentation pieces, how it's wired into
[the composition root](../08-tech-preact-typescript.md#composition-root-inversifyjs),
and where its tests live.
