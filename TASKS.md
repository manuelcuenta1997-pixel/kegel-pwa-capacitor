# TASKS

## Milestone A — Foundation (current)

### Acceptance checklist
- [x] Monorepo scaffolded with pnpm workspaces.
- [x] `/apps/web` created with React + TypeScript + Vite + PWA plugin.
- [x] `/apps/native` created with Capacitor shell configuration for iOS + Android.
- [x] Pure domain module implemented for 42-day mapping, sessions/day math, 3-hour lock, and midnight reset.
- [x] Persistence abstraction implemented with Capacitor Preferences adapter and web localStorage fallback.
- [x] Unit tests added for day/week mapping, remaining sessions, 3-hour lock, persistence adapters, and midnight reset.
- [x] README updated with run instructions.

## Next milestones (not started)
- [ ] Milestone B: Session UX enforcing anti-hypertonicity lock and pain-stop safety flow.
- [ ] Milestone C: Freemium/premium access controls and subscription integration.
- [ ] Milestone D: Courses, analytics, reminders, and clinical plan ingestion.

## Open TODO / blocking clarification
- [ ] Appendix A full specification content (including `CLINICAL_PLAN`, exact warning text, and Spanish red flags text) was not present in the provided prompt body; cannot be copied byte-for-byte until provided.

## Validation notes
- Attempted to install dependencies and run tests, but package registry access is blocked in this environment (HTTP 403), so test execution is currently blocked.
