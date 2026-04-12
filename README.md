# Staretz Blog

> *Staretz és un projecte personal sobre qualsevol cosa que s'em creui pel davant. Esteu avisats.*

Staretz is a sleek, minimalist personal blog built on top of modern web architectural practices. 

## Architecture

This blog leverages an architectural exercise to strictly adhere to **Domain-Driven Design (DDD)** and **Hexagonal Architecture** principles. The core application logic and presentation constraints are architecturally decoupled.

### Tech Stack
- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: Signals
- **Language**: Strict TypeScript
- **Typography**: Google's [Inconsolata](https://fontsource.org/fonts/inconsolata)

## Features

- **Hexagonal UI Boundaries**: Rather than conventional structure, components and layouts actively operate under the `src/core/ui` domain tier, segregating UI constructs correctly.
- **Dynamic Theming Ecosystem**: Built-in script hydration automatically applies user system-preferences and handles local storage caching natively bypassing framework bloat.
- **Image Variant Handling**: Actively adapts non-transparent JPEG graphic logos through responsive element swaps and inverted light filters. 
- **Pixel-Art SVGs**: Features unique, hand-crafted 14x14 pixel-styled SVG vector paths tailored for the theme iteration controls.
- **Minimalist Aesthetic**: Engineered around a sharp black-on-white/white-on-black layout complimented by brilliant magenta (`#df14df`) active highlights.
- **Sticky Footer Dynamics**: A highly robust Flex layout providing absolute sticky-bottom capabilities preserving component symmetry on any display ratio.

## Working With the Project

All commands run directly through `pnpm` inside the terminal.

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `pnpm install`      | Resolves and installs the package dependencies   |
| `pnpm dev`          | Launches the active local dev-server             |
| `pnpm build`        | Outputs the production build directly to `dist/` |

**Deployment Location:**
The project tracks via `origin` at `git@github.com:lunaticfriki/staretz.git`.
