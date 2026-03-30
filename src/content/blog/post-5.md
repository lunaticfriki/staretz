---
title: "Scaling PNPM in Monorepos"
description: "Why we standardized on pnpm for all Staretz JS/TS projects."
pubDate: 2026-03-27
heroImage: "https://picsum.photos/seed/post5/800/400"
---

Since we updated our guidelines today to strictly employ **pnpm**, let's review why:

### Speed and Space
Symlinking packages from a global store dramatically cuts down installation times and node_modules bloat. It also natively supports workspaces which makes separating the shared UI catalog from the Domain logic effortless.
