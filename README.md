# Cyber Range GUI

![CI](https://github.com/SadmaFaahiim/Cyber-Range-Frontend/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)

A desktop-first, frontend-only React SPA that simulates a **cyber-range exercise setup console**. Operators are guided through a 5-step workflow — infrastructure selection, network topology visualization, Red/Blue team selection, team-specific tool selection, and an exercise readiness check — entirely with local mock data. No backend, no authentication.

---

## Tech Stack

| Layer        | Technology                        | Version |
| ------------ | --------------------------------- | ------- |
| UI           | React                             | 19.x    |
| Language     | TypeScript (strict)               | 5.x     |
| Build tool   | Vite                              | 6.x     |
| Styling      | Tailwind CSS                      | 4.x     |
| Components   | shadcn/ui (Tailwind v4 compatible) | latest  |
| Topology     | React Flow (`@xyflow/react`)      | 12.x    |
| State        | Zustand                           | 5.x     |
| Routing      | React Router                      | 7.x     |
| Animation    | Motion                            | 11.x    |
| Icons        | Lucide React                      | latest  |
| Lint/Format  | Biome                             | latest  |
| Unit tests   | Vitest + Testing Library          | 2.x     |
| E2E tests    | Playwright                        | latest  |

## Prerequisites

- **Node.js** >= 22 (`node --version`)
- **npm** >= 10 (`npm --version`)
- **Git** >= 2.40 (`git --version`)

## Setup

```bash
# 1. Clone the repository
git clone git@github.com:SadmaFaahiim/Cyber-Range-Frontend.git
cd cyber-range-ui

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:5173)
npm run dev
```

## Available npm scripts

| Command                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start Vite dev server on `:5173`                  |
| `npm run build`           | Type-check + production build to `dist/`          |
| `npm run preview`         | Preview the production build locally              |
| `npm run typecheck`       | Run TypeScript checker (`tsc --noEmit`)           |
| `npm run lint`            | Biome lint + format check                         |
| `npm run lint:fix`        | Auto-fix lint/format issues                       |
| `npm run format`          | Auto-format all files with Biome                  |
| `npm run test`            | Run unit/component tests (Vitest)                 |
| `npm run test:watch`      | Run Vitest in watch mode                          |
| `npm run test:e2e`        | Run Playwright E2E tests                          |
| `npm run check`           | Lint + typecheck + unit tests (CI gate)           |

## Folder structure

```
cyber-range-ui/
├── public/                  # Static assets
├── src/
│   ├── app/                 # App entry, router, providers
│   ├── pages/               # Route-level pages (lazy-loaded)
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (button, card, badge…)
│   │   ├── layout/          # AppShell, Header, Stepper
│   │   ├── infrastructure/  # Template cards, builder palette
│   │   ├── topology/        # React Flow canvas + nodes/
│   │   ├── teams/           # Red/Blue team selection
│   │   ├── team-tools/      # Tool grid + selection
│   │   └── readiness/       # Readiness checklist/summary
│   ├── data/                # Local mock data (templates, tools)
│   ├── store/               # Zustand cyber-range store
│   ├── types/               # Shared TypeScript interfaces
│   ├── lib/                 # utils, validation
│   └── styles/              # Tailwind v4 globals + design tokens
├── tests/
│   ├── unit/                # Vitest unit/component tests
│   └── e2e/                 # Playwright specs
├── .github/                 # CI workflow, PR/issue templates
└── .vscode/                 # Shared workspace settings
```

## Branch strategy

```
main
  └── develop
        ├── feature/infrastructure
        ├── feature/topology
        ├── feature/team-selection
        ├── feature/team-tools
        ├── feature/readiness
        └── feature/testing
```

- `main` — production-ready. Only merged from `develop`. Tagged on releases.
- `develop` — integration branch. All features merge here.
- Feature branches — created from `develop`, merged back via PR.

**Rules:** no direct pushes to `main` or `develop`; all work via pull requests; PRs require at least **1 reviewer approval**; branch names follow `feature/* | fix/* | chore/* | test/*`.

### Branch protection settings (GitHub UI)

Configure on both `main` and `develop` under *Settings → Branches → Branch protection rules*:

| Setting                                   | main    | develop |
| ----------------------------------------- | ------- | ------- |
| Require a pull request before merging     | ✅       | ✅       |
| Required approving reviews                | 1       | 1       |
| Dismiss stale reviews when PR updated     | ✅       | ✅       |
| Require status checks to pass             | ✅       | ✅       |
| Required checks                           | `Biome lint`, `TypeScript type check`, `Unit & component tests (Vitest)`, `Playwright E2E` | same |
| Do not allow force pushes                 | ✅       | ✅       |
| Do not allow deletions                    | ✅       | ✅       |

> **Note:** for private repos, required review settings are a free [GitHub Team](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/managing-access-to-your-organizations-repositories) feature. The workflow itself runs on any private repo.

## Team role ownership

| Role                       | Ownership                                                        |
| -------------------------- | --------------------------------------------------------------- |
| Frontend architecture      | App shell, routing, Zustand store, providers, validation gateway |
| UI engineer                | shadcn/ui + Tailwind components, design tokens, dark theme       |
| Topology engineer          | React Flow canvas, custom memoized node components, edges        |
| Workflow engineer          | Team selection, team tools, readiness screens                   |
| QA / testing               | Vitest unit tests, Testing Library, Playwright E2E specs         |

## Workflow steps

1. **Infrastructure** — pick a template (Corporate Network, Data Center, Banking Network) or build from components.
2. **Topology** — visualize/assemble the network graph with React Flow.
3. **Team Selection** — choose Red or Blue team.
4. **Team Tools** — select 3–5 tools (min 3, max 5, at least 1 required tool per team).
5. **Readiness** — gate on infrastructure ✓ team ✓ tools ✓.

## Contributing

Read **[CONTRIBUTING.md](./CONTRIBUTING.md)** before starting work — it covers branching, Conventional Commits, PR etiquette, and the review flow.

### Quick contributing loop

1. Branch: from `develop` → `feature/<name>`
2. Commit: Conventional Commits (see below)
3. Push & open a PR into `develop`
4. Wait for CI (Biome → TSC → Vitest → Playwright) + 1 approval
5. Merge via squash; delete the branch

### Commit message format (Conventional Commits)

```
feat(topology): add FirewallNode custom component
fix(tools): correct minimum tool validation logic
chore(deps): upgrade React Flow to v12.1
test(readiness): add unit tests for readiness calculation
docs(readme): document branch strategy
```

## Definition of Done

A task or PR is **done** only when **all** of the following hold:

- [ ] TypeScript compiles with zero errors against `strict` mode
- [ ] Biome lint passes with zero issues
- [ ] No hardcoded display text in components — typed data/constants used
- [ ] All new/changed UI components are fully typed
- [ ] All new/changed component state is covered by unit or component tests
- [ ] All steps of the primary E2E workflow pass in a real browser
- [ ] Design tokens used for colors/spacing — no ad-hoc hex values
- [ ] Works in dark theme (the only theme) at desktop viewport
- [ ] No `console.log`, dead code, or unused imports
- [ ] PR scoped to one feature and reviewed by at least one other engineer
- [ ] Documentation updated where behavior is user-facing

---

## License

Internal use — private repository. No public distribution.