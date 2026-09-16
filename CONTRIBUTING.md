# Contributing to Cyber Range GUI

Welcome! This guide defines how the team collaborates on the Cyber Range GUI repository. Read it before making your first contribution.

## Table of contents

- [Branch naming](#branch-naming)
- [Commit message format](#commit-message-format)
- [PR size recommendation](#pr-size-recommendation)
- [Code review etiquette](#code-review-etiquette)
- [Resolving merge conflicts on develop](#resolving-merge-conflicts-on-develop)

---

## Branch naming

All branches are created **from `develop`** and follow one of these prefixes:

| Prefix     | Purpose                                 | Example                          |
| ---------- | --------------------------------------- | -------------------------------- |
| `feature/` | New functionality or user-facing behavior | `feature/topology`             |
| `fix/`     | Bug corrections                          | `fix/overlap-detection`          |
| `chore/`   | Maintenance, tooling, dependency bumps  | `chore/upgrade-xyflow`           |
| `test/`    | Test-only additions or changes           | `test/validation-edge-cases`     |

**Rules**

- Lowercase identifiers, words separated by `-`.
- No direct pushes to `main` or `develop` — ever. All merges go through a PR with at least **1 approval**.
- Delete the branch after it is merged.
- Keep branches single-purpose; if scope grows, split into a new branch.

## Commit message format

We use **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <subject>

[optional body]
[optional footer(s)]
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `test`, `docs`.

**Scope** indicates the workflow area — one of: `shell`, `builder`, `topology`, `readiness`, `validation`, `store`, `deps`.

**Examples**

```
feat(builder): add snap-to-grid on node drop
fix(canvas): resolve node overlap detection edge case
chore(deps): upgrade @xyflow/react to 12.12
test(validation): add edge cases for validateNoOverlap
refactor(store): simplify removeNode action
```

**Guidelines**

- Imperative mood in the subject line: *"add"*, *"fix"*, **not** *"added"*, *"fixed"*.
- Subject ≤ 72 characters, lowercase after the type.
- Reference issues/PRs in the footer: `Closes #42`.

## PR size recommendation

- Keep PRs **under 400 lines changed** (excluding lockfiles and generated data).
- If a change exceeds this, split it into a sequence of smaller PRs.
- Move large refactors behind a dedicated `refactor/*` branch so `develop` stays mergeable.

## Code review etiquette

**For the reviewer**

- Review within **24 hours** of being requested.
- Use **suggestion comments**, not direct edits — let the author apply changes.
- Approve only when **all** checklist items in the PR template pass.

**For the author**

- Fill in `.github/PULL_REQUEST_TEMPLATE.md` completely and tick the self-review checklist.
- Add screenshots or recordings for any UI change.
- Respond to every comment; fix feedback in new commits (no force-push over reviews).

## Resolving merge conflicts on develop

```bash
# 1. Pull latest develop
git checkout develop
git pull origin develop

# 2. Switch back to your branch and merge develop into it
git checkout your-branch
git merge develop

# 3. Resolve conflicts file by file, then commit and push
git add .
git commit
git push
```

**Conflict resolution tips**

- Run `npx biome check --write <resolved-files>` after resolving — most conflicts in this repo are formatting drift.
- Re-run `npm run typecheck && npm run test` before pushing.
- Never force-push to a shared branch or to `main`/`develop`.

---

Questions? Ping the Frontend architecture owner or open a discussion in the repo.