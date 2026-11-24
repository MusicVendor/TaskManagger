# Task Manager

A full-stack collaborative task management application for organizing projects, assigning work, tracking task status, and keeping project members synchronized in real time.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socketdotio&logoColor=white)](https://socket.io/)

## Project Overview

Task Manager provides a responsive Kanban-style workspace where users can:

- Sign in securely with Google OAuth
- Create, rename, select, and delete projects
- Add and manage project tasks
- Move tasks between **To Do**, **In Progress**, and **Completed**
- Assign tasks to registered users by email
- Invite existing users to collaborate on a project
- Receive live task create, update, and delete events through WebSockets

The application separates the browser-based presentation layer from the authenticated REST API and PostgreSQL persistence layer. It is structured for independent client and server deployment.

## Architecture

```text
Browser / React application
        |
        | HTTP (REST) + Google ID token
        v
Express API server
        |
        +--> Google OAuth token verification
        +--> JWT authorization middleware
        +--> Project and task controllers
        |
        | PostgreSQL protocol
        v
PostgreSQL / Neon database
        ^
        |
        +---- Socket.IO project rooms
               (task_created, task_updated, task_deleted)
```

### Frontend

- **React 19** for component-based UI
- **Vite** for development and production builds
- **React Router** for application routing
- **Tailwind CSS** and **shadcn/ui**-style components for the interface
- **Google Identity Services** for sign-in
- **Socket.IO Client** for real-time project updates
- **ProjectContext** for selecting the active project
- **AuthContext** for retaining the authenticated user and access token

The sidebar manages project CRUD operations, while the main workspace divides tasks into three status columns and provides task/member dialogs.

### Backend

- **Node.js** and **Express 5** for the REST API
- **PostgreSQL** through the `pg` connection pool
- **Google Auth Library** for server-side Google ID token verification
- **JSON Web Tokens** for short-lived access and refresh credentials
- **Socket.IO** for project-specific real-time events
- **CORS and cookie middleware** for configured browser communication

The server exposes health and authentication routes, then applies JWT verification to project and task routes.

### Request Flow

1. The client sends a Google credential to `/login/google`.
2. The server validates the credential with Google.
3. The user is found or created in PostgreSQL.
4. First-time users receive a starter project and sample tasks.
5. The server issues a 10-minute access token and a 1-day refresh token.
6. The client sends the access token in the `Authorization: Bearer` header.
7. Protected routes validate the token and attach `req.user`.
8. Task mutations emit events to the corresponding `project_<id>` Socket.IO room.

## Database Schema

The database is initialized automatically at server startup through SQL in `server/models/`.

### `users`

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` / primary key | Internal user identifier |
| `google_id` | `VARCHAR(255)` | Unique Google subject identifier |
| `email` | `VARCHAR(255)` | Unique account email |
| `first_name` | `VARCHAR(255)` | Google-provided given name |
| `last_name` | `VARCHAR(255)` | Google-provided family name |
| `refresh_token` | `TEXT` | Stored refresh credential |

### `projects`

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` / primary key | Project identifier |
| `name` | `VARCHAR(255)` | Project name |

### `project_members`

| Column | Type | Description |
|---|---|---|
| `project_id` | `INT` | Foreign key to `projects.id`; cascades on project deletion |
| `user_id` | `INT` | Foreign key to `users.id` |

`project_members` is the many-to-many relationship between users and projects.

### `tasks`

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` / primary key | Task identifier |
| `created_by` | `INT` | User that created the task |
| `project_id` | `INT` | Owning project; cascades on project deletion |
| `user_assigned` | `INT[]` | Internal IDs of users assigned to the task |
| `task_name` | `VARCHAR(255)` | Task title |
| `task_description` | `TEXT` | Optional task details |
| `task_status` | PostgreSQL enum | `to-do`, `in-progress`, or `completed` |
| `created_at` | `TIMESTAMP` | Creation time |
| `updated_at` | `TIMESTAMP` | Last update time |
| `end_date` | `TIMESTAMP` | Optional deadline |

### Entity Relationships

```text
users ─────< project_members >───── projects
  │                                  │
  │ created_by                       │ project_id
  └────────────── tasks <────────────┘
                  │
                  └── user_assigned: integer array of user IDs
```

## Features

### Authentication

- Google OAuth 2.0 sign-in
- Server-side verification of Google ID tokens
- JWT access tokens for protected API requests
- Refresh tokens stored as HTTP-only cookies
- Automatic user provisioning on first login

### Project Management

- Create projects
- Rename projects
- Delete projects and their related tasks
- View only projects associated with the signed-in user
- Automatically open newly created projects

### Task Management

- Create tasks with title, description, status, deadline, and assignee input
- Organize tasks into three workflow columns
- Move tasks forward through the workflow
- Delete tasks with confirmation
- Filter displayed tasks to assignments relevant to the signed-in user

### Collaboration

- Add existing registered users to projects by email
- View project membership
- Assign a task to a registered collaborator
- Join project-specific Socket.IO rooms
- Synchronize task creation, status changes, and deletion across connected clients

## API Summary

All routes below except `/login/google` and `/health` require a valid access token.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | Report API and database availability |
| `POST` | `/login/google` | Authenticate with a Google credential |
| `GET` | `/projects` | List projects for the current user |
| `POST` | `/projects` or `/create/project` | Create a project |
| `PATCH` | `/projects/:projectId` or `/edit/project/:projectId` | Rename a project |
| `DELETE` | `/projects/:projectId` or `/delete/project/:projectId` | Delete a project |
| `GET` | `/projects/:projectId/members` | List project members |
| `POST` | `/projects/:projectId/members` | Add a registered member |
| `GET` | `/tasks/:projectId` | List assigned tasks for a project |
| `POST` | `/tasks/:projectId` | Create a task |
| `PATCH` | `/tasks/:taskId` or `/status/tasks/:taskId` | Change task status |
| `DELETE` | `/tasks/:taskId` or `/delete/task/:taskId` | Delete a task |

## Real-Time Updates

The client joins `project_<projectId>` when a project is selected and leaves the room when it changes or unmounts.

The server emits:

- `task_created` after a task is inserted
- `task_updated` after a status update
- `task_deleted` after a task is removed

The UI updates its local React state immediately and also responds to events broadcast to collaborators.

## Tech Stack

| Area | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 7 |
| Routing | React Router |
| UI | Tailwind CSS, shadcn/ui components, Lucide icons |
| Authentication | Google OAuth, JSON Web Tokens |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, compatible with Neon or local Docker PostgreSQL |
| Database driver | `pg` connection pool |
| Real-time communication | Socket.IO |
| Development | Nodemon, ESLint |

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL or Docker with Docker Compose
- A Google OAuth Web Client ID

### 1. Clone the repository

```bash
git clone https://github.com/MusicVendor/TaskManagger.git
cd TaskManagger
```

### 2. Configure the server

Create `server/.env` or `server/.env.local`:

```dotenv
PORT=2300
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager

CLIENT_ID=your-google-web-client-id
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
NODE_ENV=development
```

You can alternatively configure separate PostgreSQL variables:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=task_manager
```

To start local PostgreSQL with the included Compose file:

```bash
cd server
docker compose up -d
```

Then install dependencies and start the API:

```bash
npm install
npm run dev
```

The API listens on `http://localhost:2300` by default and is available at `/health`.

### 3. Configure the client

Copy the example environment file:

```bash
cd client
cp .env.example .env
```

Set:

```dotenv
VITE_CLIENT_ID=your-google-web-client-id
VITE_API_URL=http://localhost:2300
```

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### 4. Production build

```bash
cd client
npm run build
```

The resulting static application is written to `client/dist`.

## Future Work

The following improvements would extend Task Manager from a functional collaboration prototype into a production-ready platform:

- Add role-based project permissions for owners, editors, and viewers
- Support drag-and-drop task movement across workflow columns
- Add task priorities, labels, subtasks, comments, and attachments
- Send email and in-app notifications for assignments and deadlines
- Add activity history and an audit log for project changes
- Implement refresh-token rotation and secure token revocation
- Add project search, filtering, sorting, pagination, and archive views
- Move large UI domains to TypeScript with shared API types
- Add automated unit, integration, and end-to-end test coverage
- Introduce input validation and centralized API error handling
- Strengthen authorization so every mutation verifies project membership
- Add multi-factor authentication options and organization-level access
- Add database migrations and seed tooling for reliable schema evolution
- Add CI/CD, deployment previews, monitoring, and structured logging
- Improve accessibility and add keyboard and mobile interaction support

## Engineering Highlights

- Designed a normalized PostgreSQL schema for users, projects, memberships, and tasks
- Implemented Google OAuth verification on the server rather than trusting client identity claims
- Protected API operations with JWT middleware
- Used project-scoped Socket.IO rooms to minimize cross-project event traffic
- Built a responsive multi-column task workspace with React and reusable UI components
- Added automatic database schema initialization and PostgreSQL health reporting
- Structured client and server for independent development and deployment

## License

License information should be added to this repository before public distribution.
