# Cyber Range GUI

![CI](https://github.com/SadmaFaahiim/Cyber-Range-Frontend/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)

Cyber Range GUI is a desktop-first, frontend-only React SPA for designing and validating cyber-range network exercises. Operators drag PCs and routers onto a canvas, connect them with cables, review their infrastructure, and confirm exercise readiness — all through a guided **Build → Review → Ready** workflow with local mock data. No backend, no authentication.

---

## Tech stack

| Layer            | Technology                    | Version |
| ---------------- | ----------------------------- | ------- |
| UI               | React                         | 19.x    |
| Language         | TypeScript (strict)           | 5.x     |
| Build tool       | Vite                          | 6.x     |
| Styling          | Tailwind CSS                  | 4.x     |
| Components       | shadcn/ui (Tailwind v4 ready) | latest  |
| Topology        | React Flow (`@xyflow/react`)  | 12.x    |
| State            | Zustand                       | 5.x     |
| Routing          | React Router                  | 7.x     |
| Animation        | Motion                        | 11.x    |
| Icons            | Lucide React                  | latest  |
| Lint / format    | Biome                         | 2.x     |
| Unit tests       | Vitest + Testing Library      | 2.x     |
| E2E tests        | Playwright                    | latest  |

## Prerequisites

- **Node.js** 22 or newer (`node --version`)
- **npm** 10 or newer (`npm --version`)
- **Git** 2.40 or newer (`git --version`)

## Setup

```bash
# 1. Clone the repository
git clone git@github.com:SadmaFaahiim/Cyber-Range-Frontend.git
cd Cyber-Range-Frontend

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:5173)
npm run dev
```

## npm scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Start Vite dev server on `:5173`       |
| `npm run build`    | Type-check + production build to `dist/` |
| `npm run preview`  | Preview the production build locally   |
| `npm run typecheck`| Run TypeScript checker (`tsc --noEmit`) |
| `npm run lint`     | Run Biome lint and format check        |
| `npm run test`     | Run Vitest unit tests                  |
| `npm run test:e2e` | Run Playwright E2E tests               |

## Folder structure

```
src/
├── app/          # App entry, router, providers
├── components/   # UI, layout, infrastructure, topology
├── data/         # Local mock data
├── lib/          # Utils, validation, strings
├── pages/        # Dashboard, Builder, Review, Readiness
├── store/        # Zustand cyber-range store
├── styles/       # Tailwind v4 globals + design tokens
├── types/        # Shared TypeScript interfaces
tests/
├── unit/         # Vitest unit/component tests
└── e2e/          # Playwright specs
.github/          # CI workflow, PR and issue templates
.vscode/          # Shared workspace settings
```

## Branch strategy

```
main
  └── develop
        ├── feature/shell
        ├── feature/builder
        ├── feature/topology
        ├── feature/readiness
        └── feature/testing
```

**Rules**

- No direct push to `main` or `develop` — all work goes through pull requests.
- PRs require at least **1 reviewer approval** before merge.
- Branch names must follow: `feature/*` | `fix/*` | `chore/*` | `test/*`.

## Team role ownership

| Role                       | Ownership                                                       |
| -------------------------- | -------------------------------------------------------------- |
| Frontend architecture      | App shell, routing, Zustand store                              |
| UI engineer                | shadcn components, Tailwind design tokens                      |
| Topology engineer          | React Flow canvas, PCNode, RouterNode, CableEdge               |
| Workflow engineer          | Builder page, Review page, Readiness page                      |
| QA / testing               | Vitest unit tests, Playwright E2E                              |

## Contributing

1. Branch from `develop`: `git checkout -b feature/<name>`
2. Commit with Conventional Commits.
3. Push and open a PR into `develop`.
4. CI runs Biome → TypeScript → Vitest; wait for 1 approval.
5. Merge and delete the branch.

### Commit message format (Conventional Commits)

```
feat(builder): add snap-to-grid on node drop
fix(canvas): resolve node overlap detection edge case
chore(deps): upgrade @xyflow/react to 12.12
test(validation): add edge cases for validateNoOverlap
refactor(store): simplify removeNode action
```

## Definition of Done

- [ ] Reviewer can clone, `npm install`, `npm run dev` without errors
- [ ] All 3 workflow steps navigable without a backend
- [ ] `npm run test` passes
- [ ] `npx playwright test` passes
- [ ] No hardcoded UI strings in JSX
- [ ] TypeScript strict passes with 0 errors
- [ ] Biome lint passes with 0 errors

---

Internal use — private repository. No public distribution.