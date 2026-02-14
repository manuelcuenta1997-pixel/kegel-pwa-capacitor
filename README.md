# kegel-pwa-capacitor

Milestone A foundation for a pnpm monorepo containing a web PWA and Capacitor native shell.

## Workspace layout

- `apps/web`: React + TypeScript + Vite PWA app.
- `apps/native`: Capacitor shell configured for iOS/Android packaging.
- `packages/core`: Pure domain and persistence logic with unit tests.

## Requirements

- Node.js 20+
- pnpm 9+

## Install

```bash
pnpm install
```

## Run web app

```bash
pnpm dev:web
```

## Run tests

```bash
pnpm test
```

## Native shell basics

```bash
pnpm --filter @app/native sync
pnpm --filter @app/native open:ios
pnpm --filter @app/native open:android
```
