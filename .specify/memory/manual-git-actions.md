# Manual Git & GitLab Actions Reference

**TL;DR:** These actions MUST be requested to the user, never executed automatically by agents.

---

## Git Operations (Always Request)

```bash
# Commit — user should verify message
git commit -m "feat: description"

# Push — requires auth
git push origin main

# Force push — DESTRUCTIVE, ask first
git push origin main --force

# Pull / Merge — may have conflicts
git pull origin main
git merge feature-branch

# Create PR / MR — provide title + body
# User creates via UI or: gh pr create --title "..." --body "..."
```

---

## GitLab CI/CD & Docker Registry

```bash
# Login to registry (first time only, requires PAT)
docker login registry.gitlab.com

# Build & push Docker image
npm run docker:build
npm run docker:push

# Check CI status
# → GitLab UI: Pipelines tab
# → Or: git log --oneline && check if commit has pipeline
```

---

## Deployment (Production)

```bash
# Portainer redeploy (via UI):
# 1. Stacks → bizu-hub
# 2. Click "Update the stack"
# 3. Confirm

# Migrations (via Portainer Console on postgres container):
psql -U portal -d portal -f drizzle/0001_flippant_marvel_apes.sql

# Seed (via container console or npm):
npm run db:seed           # 3 original posts
npm run db:seed:test      # 1 test post (gallery + media + attachments)
npm run db:seed:full      # 4 posts (test post + 3 originals)
```

---

## Example: Full CI/CD Flow (User Executes)

```bash
# 1. Make changes locally
# ... edit files ...

# 2. Commit & push (user runs)
git add .
git commit -m "feat(blog): implement dynamic blog"
git push origin main

# 3. GitLab CI automatically:
# - Runs linting/tests (see .gitlab-ci.yml)
# - Builds Docker image
# - Pushes to registry

# 4. Verify in Portainer
# - Pull latest image
# - Redeploy stack
# - Run migrations & seed
```

---

## When to Request Each Action

| Situation | Action | User Does | Agent Does |
|-----------|--------|-----------|-----------|
| Implementation done, tests pass | `git commit` | Verifies message, runs cmd | Provides commit message template |
| Ready for production | `git push` | Runs cmd, checks CI | Provides push instructions |
| PR approval needed | Create PR/MR | Creates via UI | Provides title + body markdown |
| Image built, CI passed | Redeploy | Clicks Portainer UI | Provides step-by-step instructions |
| DB schema changed | Apply migration | Pastes SQL into psql | Provides SQL file path or command |

---

## Key Files

- `.cursor/rules/git-gitlab-manual-actions.mdc` — Full rule for agents
- `.gitlab-ci.yml` — CI/CD pipeline
- `Dockerfile` — Docker build config
- `deploy/README.md` — Deployment guide
- `npm run docker:push` — Script in package.json

---

## Q&A for Agents

**Q: Should I run `git push` for the user?**
A: No. Always provide the exact command and ask the user to run it.

**Q: What if the user says "do it for me"?**
A: Explain that git operations need authentication (SSH keys), and it's safer/clearer if they run it.
Then provide the command to paste into their terminal.

**Q: Should I check if CI passed?**
A: Yes, you can check logs and status. But pulling the image or deploying requires user action.

**Q: Can I trigger a GitLab pipeline?**
A: No. Pipelines trigger on git push (automatic). You can only ask the user to push.
