# AGENTS.md — AI Coding Agent Guidelines

## Project Overview

Project Management Platform (Mini Jira/Trello clone). A full-featured agile project management tool built with Next.js 16, Mantine v9, and Zustand.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router) |
| UI Library | Mantine v9.3.1 |
| CSS | Tailwind CSS v4.3.0 + PostCSS |
| State Management | Zustand v5.0.14 |
| Charts | Recharts v3.8.1 + @mantine/charts |
| Dates | dayjs v1.11.21 + @mantine/dates |
| Icons | @tabler/icons-react |
| Toasts | react-hot-toast |
| Database | MongoDB 8 (Docker) |
| GUI | Mongo Express (Docker) |
| Container | Docker + Compose |
| Real-time | Socket.io (future) |

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with AppShell + MantineProvider
│   ├── page.tsx                  # "For you" dashboard
│   ├── not-found.tsx             # Custom 404 page
│   ├── globals.css               # Tailwind + custom theme
│   ├── projects/
│   │   ├── page.tsx              # Browse all projects
│   │   └── [projectId]/
│   │       ├── page.tsx          # Project home (redirects)
│   │       ├── board/page.tsx    # Kanban board
│   │       ├── list/page.tsx     # List view
│   │       ├── timeline/page.tsx # Timeline/Gantt
│   │       └── settings/page.tsx # Project settings
│   └── issues/
│       └── page.tsx              # Global issues list
├── components/
│   ├── layout/                   # Shell components
│   │   ├── AppShell.tsx
│   │   ├── TopBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProjectNav.tsx
│   ├── ui/                       # Small reusable UI components
│   │   ├── UserMenu.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── CreateButton.tsx
│   │   └── ToasterProvider.tsx
│   ├── board/                    # Board-related components
│   ├── issue/                    # Issue-related components
│   └── project/                  # Project-related components
├── store/                        # Zustand stores
│   ├── auth-store.ts
│   └── app-store.ts
├── types/                        # TypeScript interfaces
│   ├── user.ts
│   ├── project.ts
│   ├── issue.ts
│   └── common.ts
├── constants/                    # Static data & config
│   ├── navigation.ts
│   └── index.ts
├── hooks/                        # Custom React hooks
│   └── use-current-user.ts
├── lib/                          # Business logic, API clients
└── utils/                        # Pure utility functions
    └── index.ts
```

## Coding Conventions

### Component Rules
- **Maximum 150 lines per component file.** If a component exceeds this, extract sub-components.
- One component per file, default-exported.
- Use named exports for hooks, utils, types, and constants.

### Naming
- **Components:** PascalCase (`UserMenu.tsx`, `NotificationBell.tsx`)
- **Hooks:** camelCase with `use` prefix (`use-current-user.ts` → `useCurrentUser`)
- **Stores:** kebab-case with `-store` suffix (`auth-store.ts`)
- **Types:** camelCase (`user.ts`, `project.ts`)
- **Constants:** camelCase (`navigation.ts`)
- **Utils:** camelCase (`index.ts`)
- **CSS classes:** Tailwind utility classes; Mantine component props for styling

### Imports Order
1. React / Next.js
2. Third-party libraries (Mantine, zustand, dayjs, recharts)
3. Types (`@/types/...`)
4. Store (`@/store/...`)
5. Components (`@/components/...`)
6. Hooks (`@/hooks/...`)
7. Constants (`@/constants/...`)
8. Utils (`@/utils/...`)
9. CSS imports last

### State Management
- **Zustand** for global state (auth, app UI state).
- Local `useState` / `useReducer` for component-local state.
- No React Context for global state — Zustand is the single source of truth.
- Stores are plain objects (no classes); actions are plain functions on the store.

### Component Patterns
- Use **Mantine primitives** (`Group`, `Stack`, `Paper`, `Text`, etc.) for layout.
- Use **Tailwind utility classes** for spacing/sizing overrides (`w-96`, `p-4`, `gap-2`).
- Use **CSS modules** or Mantine `style` prop for component-specific styles.
- Prefer Mantine's `AppShell` for the main layout shell.
- Prefetch data in server components where possible; use `'use client'` only when needed.
- Custom 404 pages must be `'use client'` to use Mantine components.

### TypeScript
- Strict mode enabled.
- Avoid `any`. Use `unknown` if type is truly uncertain.
- Prefer `interface` over `type` for object shapes.
- Use `type` for unions, intersections, and utility types.

## Example Component Template

```tsx
'use client';

import { Group, Text, Avatar } from '@mantine/core';

interface ComponentProps {
  name: string;
  email: string;
}

export function Component({ name, email }: ComponentProps) {
  return (
    <Group>
      <Avatar name={name} color="initials" />
      <div>
        <Text size="sm">{name}</Text>
        <Text size="xs" c="dimmed">{email}</Text>
      </div>
    </Group>
  );
}
```

## Protected Files
- **`opencode.json`** — Do NOT modify, commit, or push this file. It contains MCP configuration for the AI toolchain and must remain untouched by any agent.

## Git Workflow
- Feature branches: `feat/<name>`
- Commits: conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`)
- No direct pushes to `main` without PR

## Docker
```bash
docker compose up -d          # Start full stack (app + MongoDB + Mongo Express)
docker compose down           # Stop all containers
docker compose down -v        # Stop and delete volumes (clears DB)
docker compose logs -f        # Follow container logs
docker compose build          # Rebuild images
```

Mongo Express available at http://localhost:8081 (login: `admin` / `admin`).

## Build & Verify
```bash
pnpm run build    # Full production build
pnpm run lint     # ESLint check
pnpm run dev      # Dev server on localhost:3000
```
