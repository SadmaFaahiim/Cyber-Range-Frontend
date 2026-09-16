# Contributing to Cyber Range GUI

Welcome! This guide defines how the team collaborates on the Cyber Range GUI repository. Read it before making your first contribution.

## Table of contents

- [Branch naming](#branch-naming)
- [Workflow overview](#workflow-overview)
- [Commit message format](#commit-message-format)
- [PR size recommendation](#pr-size-recommendation)
- [Opening a pull request](#opening-a-pull-request)
- [Code review etiquette](#code-review-etiquette)
- [Resolving merge conflicts on develop](#resolving-merge-conflicts-on-develop)

---

## Branch naming

All branches are created **from `develop`** and follow a strict prefix pattern:

| Prefix   | Purpose                                                        | Example                        |
| -------- | -------------------------------------------------------------- | ------------------------------ |
| `feature/` | New functionality or user-facing behavior                    | `feature/topology`             |
| `fix/`     | Bug corrections                                               | `fix/tool-validation`          |
| `chore/`   | Maintenance, tooling, dependency bumps                        | `chore/upgrade-xyflow`         |
| `test/`    | Test-only additions or changes                                | `test/readiness-calc`          |

**Rules**

- Lowercase identifiers, words separated by `-`.
- No direct pushes to `main` or `develop` — ever. All merges go through a PR with at least **1 approval**.
- Delete the branch after it is merged.
- If work expands beyond the branch's scope, open a separate branch — keep branches single-purpose.

## Workflow overview

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

1. Pull latest `develop`: `git checkout develop && git pull`
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit often (Conventional Commits), push.
4. Open a PR into `develop`. CI runs Biome → TypeScript → Vitest → Playwright.
5. Obtain one approval, squash-merge, delete the branch.

## Commit message format

We use **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <subject>

[optional body]
[optional footer(s)]
```

**Types**

- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance / deps / tooling
- `refactor` — behavior-preserving restructure
- `test` — tests only
- `docs` — documentation only

**Scope** indicates the workflow area — one of: `shell`, `infrastructure`, `topology`, `teams`, `tools`, `readiness`.

**Examples**

```
feat(topology): add FirewallNode custom component
fix(tools): correct minimum tool validation logic
chore(deps): upgrade React Flow to v12.1
test(readiness): add unit tests for readiness calculation
style(teams): align Red/Blue card semantics with design tokens
```

**Guidelines**

- Imperative mood in the subject line: *"add"*, *"fix"*, **not** *"added"*, *"fixed"*.
- Subject ≤ 72 characters, lowercase after the type.
- Reference issues/PRs in the footer: `Closes #42`.

## PR size recommendation

- Keep PRs **under 400 lines changed** (excluding lockfiles and generated data).
- If a change exceeds this, split it into a sequence of smaller PRs (e.g. scaffolding → logic → UI).
- Small PRs review faster, fail less in CI, and are easier to rebase.
- Move large refactors behind a dedicated `refactor/*` branch so `develop` stays mergeable.

## Opening a pull request

1. Fill in `.github/PULL_REQUEST_TEMPLATE.md` completely.
2. Tick the self-review checklist — CI will re-check it objectively.
3. Link the issue(s) the PR closes.
4. Add screenshots/recordings for any UI change.
5. Request review from at least one engineer familiar with the affected area (see role ownership in the README).
6. Keep the PR title in Conventional Commits format.

**Before marking "Ready for review"**

- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run test` passes
- [x] New UI verified at desktop viewport in dark theme
- [ ] (if applicable) `npm run test:e2e` passes locally

## Code review etiquette

**For the author**

- Request reviews early and respond to every comment.
- Fix feedback in new commits — do not force-push over a reviewer's comments unless asked.
- If you disagree, explain *why* with code or data rather than accepting silently.
- Keep the diff focused; don't fold unrelated formatting changes into feature PRs.

**For the reviewer**

- Review within **1 business day** of being requested.
- Distinguish between blockers ("should fix before merge") and nitpicks ("optional").
- Verify the checklist items the author claims, not just the code path you happen to read.
- Approve only when the acceptance criteria are met and CI is green.

**Approval policy:** 1 approval is required; the approving reviewer must not be the PR author.

## Resolving merge conflicts on develop

`develop` moves fast — conflicts will happen. Since branches can be long-lived, **prefer rebasing** to keep history linear.

```bash
# 1. Fetch latest develop
git fetch origin develop

# 2. Rebase your branch onto it
git checkout feature/my-feature
git rebase origin/develop

# 3. Resolve conflicts file-by-file, then continue
git add <conflicted-file>
git rebase --continue

# 4. Force-push the rewritten branch (your own non-shared branch only)
git push --force-with-lease origin feature/my-feature
```

**Conflict resolution tips**

- Run Biome after resolving: `npx biome check --write <resolved-files>` — most merge conflicts in this repo are formatting drift.
- Re-run `npm run typecheck && npm run test` after the rebase before pushing.
- If the rebase becomes too messy (> a few files), abort, merge `develop` into your branch instead, and note it in the PR:
  ```bash
  git rebase --abort
  git merge origin/develop
  ```
- Never force-push to a shared branch or to `main`/`develop` — `--force-with-lease` on your **own** feature branch only.

---

Questions? Ping the Frontend architecture owner or open a discussion in the repo.