# End-to-End Testing (Playwright + Cucumber + Gherkin)

Everything in [07-testing-strategy.md](07-testing-strategy.md) tests layers
in isolation — the domain with no mocks, the application layer with mocked
ports, presentation with a mocked state service. None of that proves the
whole system actually works together through a real browser: real routing,
real rendering, a real production build. That's what end-to-end tests are
for, and they run through **Cucumber** as the actual test runner — driving
a real browser via **Playwright** — with scenarios written in **Gherkin**.

## Why Cucumber as the runner, not just Playwright

Playwright ships its own test runner and a popular add-on
(`playwright-bdd`) that converts `.feature` files into Playwright test
files. That's a legitimate option, but it means BDD is a layer bolted onto
Playwright's runner. Using `@cucumber/cucumber` directly as the runner
keeps this a genuine Cucumber/Gherkin setup — standard `.feature` file
conventions, Cucumber's own reporting, and a `World`/step-definition model
that isn't tied to any one browser automation tool, with Playwright plugged
in purely as the thing that drives the browser inside it.

## Folder structure

```
e2e/
  features/
    home.feature
    blog.feature
    category.feature
    dashboard.feature
    navigation.feature
    post.feature
    branding.feature
    splash.feature
  step-definitions/
    home.steps.ts
    navigation.steps.ts
    category.steps.ts
    dashboard.steps.ts
    branding.steps.ts
    splash.steps.ts
  support/
    world.ts            — the Cucumber World, carrying the Playwright Page
    hooks.ts             — Before/After: browser/page lifecycle, the default step timeout
cucumber.cjs              — config, auto-detected by the cucumber-js CLI
tsconfig.e2e.json          — separate from the app's tsc project references
```

Naming here intentionally follows the Cucumber/Playwright ecosystem's own
conventions (`lowercase.feature`, `lowercase.steps.ts`) rather than the
project's `<Concept>.<kind>.ts` rule from
[06-vertical-slicing.md](06-vertical-slicing.md#file-naming-convention) —
these files are read by Cucumber's own tooling and by non-engineers
(product, QA) reading `.feature` files as living documentation; matching
the ecosystem's expectations matters more here than internal consistency
with the app's own source file naming.

## The World and hooks

A custom `World` class carries whatever state a scenario's steps need to
share — here, the Playwright `Page`:

```ts
// e2e/support/world.ts
import { World, setWorldConstructor } from '@cucumber/cucumber'
import type { Page } from '@playwright/test'

export class PlaywrightWorld extends World {
  page!: Page
}

setWorldConstructor(PlaywrightWorld)
```

Hooks own the browser lifecycle: launch once for the whole run, a fresh
context and page per scenario (so scenarios can't leak state into each
other — no shared cookies/storage), close down afterward:

```ts
// e2e/support/hooks.ts
import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium, type Browser, type BrowserContext } from '@playwright/test'
import type { PlaywrightWorld } from './world'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'

// Cucumber's own 5000ms default step timeout can be tighter than a real
// network round trip to Firestore takes under load — raise it so a slow
// read fails on its own assertion message, not a generic step timeout.
setDefaultTimeout(15000)

let browser: Browser
let context: BrowserContext

BeforeAll(async function () {
  browser = await chromium.launch()
})

AfterAll(async function () {
  await browser.close()
})

Before(async function (this: PlaywrightWorld) {
  context = await browser.newContext({ baseURL: BASE_URL })
  this.page = await context.newPage()
})

After(async function () {
  await context.close()
})
```

## Writing scenarios

Gherkin scenarios describe user-facing behavior, not implementation:

```gherkin
Feature: Home page
  Scenario: Viewing the latest posts
    Given I am on the home page
    Then I should see 5 post previews
    And the first post should be "Shipping Fast Without Breaking Architecture"
```

Step definitions are small, generic, and reused across scenarios/features —
avoid writing one narrowly-scoped step per scenario. A handful of
navigation and assertion steps typically covers most of a site:

```ts
// e2e/step-definitions/navigation.steps.ts
import { Given, Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

Given('I am on the home page', async function (this: PlaywrightWorld) {
  await this.page.goto('/')
})

When('I click the {string} link in the header', async function (this: PlaywrightWorld, label: string) {
  await this.page.getByRole('banner').getByRole('link', { name: label }).click()
})

Then('I should see the heading {string}', async function (this: PlaywrightWorld, text: string) {
  await expect(this.page.getByRole('heading', { name: text }).first()).toBeVisible()
})
```

If a Gherkin line doesn't match any step definition, `cucumber-js` reports
it as "undefined" rather than silently passing — there's no way to
accidentally write an untested scenario step.

## Running against a real production build, not the dev server

The point of E2E is testing what actually ships. The run script:

1. Type-checks `e2e/` on its own (fast, catches typos before spending time
   on a build).
2. Starts the Firebase **Auth emulator** and seeds one fixed admin user
   (see [Auth emulator and fake repositories](#auth-emulator-and-fake-repositories-why-dashboard-e2e-needs-both)
   below).
3. Builds the app for production, with `VITE_FIREBASE_AUTH_EMULATOR_HOST`
   and `VITE_USE_FAKE_REPOSITORIES=true` set so the build points at the
   emulator and the in-memory `Fake*` adapters instead of real Firebase.
4. Serves that build (`vite preview`, not `vite dev`) on a fixed port.
5. Polls until the server responds.
6. Runs every `.feature` file against it.
7. Tears both the preview server and the emulator down in a trap,
   regardless of pass/fail.

```bash
#!/usr/bin/env bash
set -eu

PORT=4173
BASE_URL="http://localhost:$PORT"

AUTH_EMULATOR_HOST="127.0.0.1:9099"
FIREBASE_PROJECT="${VITE_FIREBASE_PROJECT_ID:-staretz-e2e}"
E2E_ADMIN_EMAIL="${E2E_ADMIN_EMAIL:-e2e@staretz.test}"
E2E_ADMIN_PASSWORD="${E2E_ADMIN_PASSWORD:-e2e-test-password}"

pnpm typecheck:e2e

pnpm exec firebase emulators:start --only auth --project "$FIREBASE_PROJECT" &
EMULATOR_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
  kill "$EMULATOR_PID" 2>/dev/null || true
}
trap cleanup EXIT

EMULATOR_READY=0
for _ in $(seq 1 60); do
  if curl -sSf "http://$AUTH_EMULATOR_HOST/" > /dev/null 2>&1; then
    EMULATOR_READY=1
    break
  fi
  sleep 0.5
done

if [ "$EMULATOR_READY" -ne 1 ]; then
  echo "Auth emulator did not become ready at $AUTH_EMULATOR_HOST" >&2
  exit 1
fi

# Seed the fixed admin user the "logged in as an admin" step signs in as.
# EMAIL_EXISTS on a rerun against an emulator that kept its state is fine —
# the account just already exists from a previous run.
curl -s -o /dev/null -X POST \
  "http://$AUTH_EMULATOR_HOST/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$E2E_ADMIN_EMAIL\",\"password\":\"$E2E_ADMIN_PASSWORD\",\"returnSecureToken\":true}"

VITE_FIREBASE_AUTH_EMULATOR_HOST="$AUTH_EMULATOR_HOST" VITE_USE_FAKE_REPOSITORIES=true pnpm build

pnpm exec vite preview --port "$PORT" --strictPort &
SERVER_PID=$!

READY=0
for _ in $(seq 1 60); do
  if curl -sSf "$BASE_URL" > /dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.5
done

if [ "$READY" -ne 1 ]; then
  echo "Preview server did not become ready at $BASE_URL" >&2
  exit 1
fi

BASE_URL="$BASE_URL" E2E_ADMIN_EMAIL="$E2E_ADMIN_EMAIL" E2E_ADMIN_PASSWORD="$E2E_ADMIN_PASSWORD" \
  NODE_OPTIONS="--import tsx" pnpm exec cucumber-js "$@"
```

Start the backgrounded server with `pnpm exec vite preview`, not
`pnpm preview` (the `package.json` script). Killing a process that's
running *as* a `pnpm run <script>` makes pnpm log its own
"command failed with exit code 143" lifecycle message to the terminal when
the trap's `kill` reaches it — harmless (the actual script's exit code is
unaffected), but it reads exactly like a failure report sitting right
under a "32 steps passed" summary. `pnpm exec` runs the binary directly,
with no script-lifecycle wrapper to log anything when it's killed. Same
reasoning for `pnpm exec firebase` over a bare `firebase` — no global
install assumed, uses the `firebase-tools` devDependency directly.

## Auth emulator and fake repositories: why dashboard e2e needs both

`/dashboard` is guarded by `RequirePolicy`
([shared-policies.md](modules/shared-policies.md)), so any scenario that
reaches it has to log in for real first — there's no way to skip
`RequireAuthenticationPolicy` from a `.feature` file, nor should there
be, since the login screen and the guard are exactly what's under test.
Logging in for real against a *real* Firebase project would mean either
committing test credentials (never — `.env*` is gitignored on purpose,
see [blog.md](modules/blog.md#infrastructure)) or requiring every
CI run/contributor to have a real Firebase project with a real user
provisioned. Neither is acceptable for a suite that's supposed to run
anywhere with `pnpm test:e2e` and nothing else.

The Firebase **Auth emulator** (`firebase emulators:start --only auth`)
solves this: it's pure Node, no Java/JVM dependency (unlike the
Firestore/Storage/Realtime-Database emulators), starts in a couple of
seconds, and accepts the exact same `signInWithEmailAndPassword` calls
`FirebaseAuthRepository` already makes
([shared-auth.md](modules/shared-auth.md#infrastructure)) — the app code
under test is unmodified; only `src/shared/firebase/auth.ts` gains a
`connectAuthEmulator(auth, ...)` call, gated behind
`VITE_FIREBASE_AUTH_EMULATOR_HOST` so it's a no-op in `pnpm dev`/`pnpm build`
where that variable is never set. `scripts/e2e.sh` seeds one fixed
`e2e@staretz.test` user into the emulator via its REST API
(`accounts:signUp`) before the build, so
`Given I am logged in as an admin`
([dashboard.steps.ts](../e2e/step-definitions/dashboard.steps.ts)) has
someone to log in as.

The catch: an ID token issued by the Auth emulator does **not** validate
against a real Firestore/Storage project — it's signed for a fictitious
local project, not the real one Firestore checks against. Once logged
in, every Firestore read/write from the app was failing with
`permission-denied`, even public reads that work fine
unauthenticated — the *malformed* credential on the request, not the
security rule content, is what Firestore rejects. So emulating Auth
alone doesn't just leave Firestore untested while logged in, it actively
breaks it. The fix is the same `VITE_USE_FAKE_REPOSITORIES` flag
mentioned above: when set, `composition-root.ts` binds
`FakePostRepository`/`FakePostImageUploader`
([blog.md](modules/blog.md#infrastructure),
[dashboard.md](modules/dashboard.md#infrastructure)) instead of the real
Firebase adapters, so nothing post-login ever touches real Firestore/
Storage at all — no token-validation mismatch possible, and every
scenario (dashboard or otherwise) now asserts against the same known
20-post seed catalog instead of whatever a real Firestore project
happens to contain. Running the *real* adapters end-to-end (against a
real Firebase project a CI job is authorized for) would need the
Firestore/Storage emulators as well, which do require Java — not wired
up here; add them if that level of coverage is ever needed.

## TypeScript/tooling specifics

- **`tsx`** transpiles the step definitions/hooks on the fly. Invoke it via
  `NODE_OPTIONS="--import tsx"` rather than trying to run
  `node_modules/.bin/cucumber-js` directly — on many installs that bin is a
  shell wrapper, not a JS file, so `node <path-to-bin>` fails; go through
  `pnpm exec cucumber-js` instead and let `NODE_OPTIONS` register the
  loader.
- **`cucumber.cjs`** (not `.js`) as the config file — `.cjs` always parses
  as CommonJS regardless of the project's `"type": "module"`, and this
  filename is one cucumber-js's CLI auto-detects without needing a
  `--config` flag.
- **`tsconfig.e2e.json`** is deliberately not referenced by the app's root
  `tsconfig.json`, so `tsc -b` (the app build) never touches it. It uses
  `"moduleResolution": "bundler"`, not `"nodenext"` — `nodenext` demands
  explicit `.js` extensions on relative imports, which `tsx`'s resolution
  doesn't require at runtime; matching the tsconfig to how the files are
  actually executed avoids fighting a type-check rule that isn't real.

## Where this fits in the testing strategy

E2E is slow relative to unit/integration tests (a real build, a real
browser) — it does NOT belong in the `pre-push` hook from
[10-git-workflow-husky.md](10-git-workflow-husky.md), which stays fast on
purpose. Run it on demand locally and as its own step in CI, separate from
the fast suite that gates every push.
