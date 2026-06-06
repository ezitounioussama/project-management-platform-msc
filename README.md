# ScrumBoard — Project Management Platform

> Plan, track, and manage your agile projects with Kanban boards, backlog management, sprint planning, and team collaboration — all in one place.

A full-featured agile project management tool inspired by Jira and Trello. Built with **Next.js 16**, **Mantine v9**, **Zustand**, and **MongoDB**.

---

## Features

### Core

| Feature | Description |
|---------|-------------|
| **Teams & Workspaces** | Create and manage teams, organize work into projects with custom visibility |
| **Kanban Boards** | Drag-and-drop boards with customizable columns, swimlanes, and WIP limits |
| **Tasks & Subtasks** | Create, assign, prioritize, and nest tasks with parent-child relationships |
| **Comments & Attachments** | Threaded discussions, file uploads, and @mentions on any work item |
| **Due Dates & Reminders** | Set deadlines with calendar scheduling, push/email reminders for approaching dates |

### Advanced

| Feature | Description |
|---------|-------------|
| **Real-Time Collaboration** | Socket.io-powered live updates — see changes from your team instantly |
| **Activity Logs** | Full audit trail of every create/update/delete operation per project |
| **Gantt Charts** | Timeline-based project planning with dependency linking and milestone tracking |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js 16.2.7](https://nextjs.org) (App Router) | SSR, routing, API routes |
| **UI Library** | [Mantine v9.3.0](https://mantine.dev) | Component library, AppShell, forms |
| **CSS** | [Tailwind CSS v4.3.0](https://tailwindcss.com) + PostCSS | Utility-first styling |
| **State** | [Zustand v5.0.14](https://github.com/pmndrs/zustand) | Global state management |
| **Charts** | [Recharts v3.8.1](https://recharts.org) + [@mantine/charts](https://mantine.dev/charts/) | Gantt, burndown, velocity charts |
| **Dates** | [dayjs v1.11.21](https://day.js.org) + [@mantine/dates](https://mantine.dev/dates/) | Date pickers, formatting |
| **Icons** | [@tabler/icons-react](https://tabler-icons.io) | UI icons (2,500+ line icons) |
| **Toasts** | [react-hot-toast](https://react-hot-toast.com) | Global toast notifications |
| **Database** | [MongoDB 8](https://www.mongodb.com) (Docker) | Document store |
| **GUI** | [Mongo Express](https://github.com/mongo-express/mongo-express) | Web-based MongoDB admin |
| **Container** | [Docker](https://www.docker.com) + Compose | Local dev environment |
| **Real-time** | Socket.io (future) | Live collaboration, presence |
| **Design** | [Material Design 3](https://m3.material.io) (Material You) | Design system, color tokens, typography |

---

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with AppShell + MantineProvider
│   ├── page.tsx                  # "For you" dashboard
│   ├── not-found.tsx             # Custom 404 page
│   ├── globals.css               # Tailwind + custom theme
│   ├── projects/                 # Project routes
│   │   ├── page.tsx              # Browse all projects
│   │   └── [projectId]/          # Per-project views
│   │       ├── page.tsx          # Project home (redirects to board)
│   │       ├── board/page.tsx    # Kanban board
│   │       ├── list/page.tsx     # List view
│   │       ├── timeline/page.tsx # Timeline / Gantt
│   │       └── settings/page.tsx # Project configuration
│   └── issues/
│       └── page.tsx              # Global issues list (across projects)
├── components/
│   ├── layout/                   # Shell components
│   │   ├── AppShell.tsx          # Mantine AppShell + provider + theme + toaster
│   │   ├── TopBar.tsx            # Logo, search, create, notifications, user
│   │   ├── Sidebar.tsx           # Collapsible zoned sidebar (Jira-style)
│   │   └── ProjectNav.tsx        # Horizontal project tabs (Board/List/Timeline/...)
│   ├── ui/                       # Small reusable UI
│   │   ├── UserMenu.tsx          # Avatar dropdown (profile, settings, logout)
│   │   ├── NotificationBell.tsx  # Bell icon with unread count indicator
│   │   ├── CreateButton.tsx      # "Create" dropdown (issue, task, sprint)
│   │   └── ToasterProvider.tsx   # Global react-hot-toast configuration
│   ├── board/                    # Board-specific components
│   ├── issue/                    # Issue-specific components
│   └── project/                  # Project-specific components
├── store/                        # Zustand stores
│   ├── auth-store.ts             # User auth, color scheme
│   └── app-store.ts              # Sidebar state, active project, UI prefs
├── types/                        # TypeScript interfaces
│   ├── user.ts
│   ├── project.ts
│   ├── issue.ts
│   └── common.ts
├── constants/                    # Static config
│   ├── navigation.ts             # Sidebar items, project tabs
│   └── index.ts
├── hooks/                        # Custom React hooks
│   └── use-current-user.ts
├── lib/                          # Business logic, API clients
└── utils/                        # Pure utility functions
    └── index.ts
```

### Data Flow

```
User Action → React Component → Zustand Store → [Re-render]
                                      ↓
                                API Routes (future) → MongoDB
```

Zustand stores are the single source of truth. Components read from stores via selectors and trigger actions. No prop drilling beyond 2 levels.

---

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- Or **Node.js** ≥ 20 + **pnpm** ≥ 9

### Installation (Docker)

```bash
git clone <repo-url>
cd project-management-platform-msc
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
Access Mongo Express at [http://localhost:8081](http://localhost:8081) (login: `admin` / `admin`).

### Installation (Local)

```bash
git clone <repo-url>
cd project-management-platform-msc
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server (Turbopack) |
| `pnpm run build` | Production build |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `docker compose up -d` | Start full stack (app + MongoDB + Mongo Express) |
| `docker compose down` | Stop all containers |
| `docker compose down -v` | Stop and delete volumes (clears DB) |
| `docker compose logs -f` | Follow container logs |

---

## Roadmap

### Release 0.1 — App Shell ✅

- [x] Next.js 16 + Mantine v9 + Tailwind v4 + Zustand scaffold
- [x] MantineProvider with light/dark theme
- [x] PostCSS with Mantine preset + Tailwind plugin
- [x] Material Design 3 design tokens integrated
- [x] Jira-style collapsible sidebar layout
- [x] Global search, create button, notifications, user menu
- [x] Project navigation with horizontal tabs (Board/List/Timeline/Settings)
- [x] "For you" dashboard page
- [x] Projects list page
- [x] Route placeholders for all project views
- [x] Custom 404 not-found page
- [x] Global toast notifications (react-hot-toast)
- [x] Docker Compose setup with MongoDB 8 + Mongo Express
- [x] Hot-reload volume mounts (no rebuild on source changes)

### Release 0.2 — Team & Project Management

- [ ] Team CRUD (create/manage workspaces)
- [ ] Project CRUD with settings (name, key, visibility)
- [ ] Member invitation flow
- [ ] Role-based permissions (Admin/Member/Viewer)
- [ ] Project-level navigation tabs fully functional

### Release 0.3 — Kanban Boards

- [ ] Board component with drag-and-drop columns
- [ ] Column CRUD (add/edit/delete/reorder)
- [ ] Card creation with title, description, assignee
- [ ] Drag-and-drop between columns (status transitions)
- [ ] WIP (Work-in-Progress) limits per column
- [ ] Swimlanes (horizontal grouping by epic/assignee)

### Release 0.4 — Tasks & Issues

- [ ] Issue detail view with all metadata
- [ ] Task hierarchy: Epic → Story → Task → Subtask
- [ ] Rich text editor for descriptions
- [ ] Label/tag system with color coding
- [ ] Priority levels (Highest/High/Medium/Low/Lowest)
- [ ] Story point estimation
- [ ] Bulk operations (batch edit, move, delete)

### Release 0.5 — Comments & Attachments

- [ ] Threaded comments on issues
- [ ] @mention autocomplete
- [ ] File attachments with preview (images, PDFs)
- [ ] Drag-and-drop file upload
- [ ] Activity feed per issue (comment history)

### Release 0.6 — Due Dates & Reminders

- [ ] Due date picker on issues
- [ ] Calendar view for project scheduling
- [ ] Reminder notifications (in-app + email)
- [ ] Overdue highlighting on boards
- [ ] Date-based sorting and filtering

### Release 0.7 — Real-Time Collaboration

- [ ] Socket.io server integration
- [ ] Live board updates (reorder, status change, new cards)
- [ ] Presence indicators (who's viewing the same board)
- [ ] Real-time comment delivery
- [ ] Conflict resolution for concurrent edits

### Release 0.8 — Activity Logs

- [ ] Full audit trail per project
- [ ] Per-issue change history with diffs
- [ ] Filterable activity feed (by user, action, date range)
- [ ] Undo / revert support for recent actions

### Release 0.9 — Gantt Charts

- [ ] Timeline view with draggable bars
- [ ] Dependency linking (finish-to-start, start-to-start)
- [ ] Milestone markers
- [ ] Auto-scheduling based on dependencies
- [ ] Export to PDF / image

### Release 1.0 — Polish & Production

- [ ] Performance optimization
- [ ] Loading states and skeleton screens
- [ ] Error boundaries and toast notifications
- [ ] Comprehensive keyboard shortcuts
- [ ] Onboarding tour for new users
- [ ] Full test coverage (unit + integration + e2e)

---

## Skills Demonstrated

| Skill | How It's Applied |
|-------|-----------------|
| **Real-Time Communication** | Socket.io for live board updates, presence, instant messaging |
| **State Management** | Zustand for global state with typed selectors and persist middleware |
| **Complex CRUD Operations** | Nested issue hierarchy (Epic → Story → Task → Subtask) with batch operations |
| **Component Architecture** | ≤150 lines/components; compound layout pattern (AppShell → TopBar/Sidebar/ProjectNav) |
| **Design Systems** | Material Design 3 token-based theming; light/dark mode; accessible by default |
| **Drag & Drop** | Kanban board card reordering with column transitions |
| **File Handling** | Drag-and-drop upload; image preview; attachment management |
| **Responsive Design** | Collapsible sidebar; adaptive grid; mobile-first breakpoints |
| **TypeScript** | Strict mode; interface-first types; discriminated unions for issue states |
| **API Design** | RESTful route patterns for projects, issues, and nested resources |
| **Containerization** | Docker Compose with MongoDB 8, Mongo Express, persistent volumes, shared network |

---

## Project Configuration

### Key Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `postcss.config.cjs` | PostCSS with Mantine preset + Tailwind |
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `Dockerfile` | Node 22 (LTS) Alpine, pnpm install, dev command |
| `docker-compose.yml` | App + MongoDB 8 + Mongo Express on shared network |
| `AGENTS.md` | AI coding agent guidelines |
| `DESIGN.md` | Material Design 3 design system reference |

---

## License

MIT
