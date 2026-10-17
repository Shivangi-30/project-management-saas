# Project Management SaaS

A full-stack project management application built with Next.js, React, and MongoDB. The application helps users manage projects and tasks through a dashboard with authentication and data persistence.

🌐 **Live Demo:** [Open Application](https://project-management-saas-9r74.vercel.app)

📦 **Repository:** [GitHub](https://github.com/Shivangi-30/project-management-saas)

## Overview

Project Management SaaS is a web application developed to practice and implement real-world full-stack development concepts, including authentication, REST APIs, database integration, and CRUD operations.

The project is built with the Next.js App Router and uses MongoDB for persistent data storage.

## Features

- **Authentication:** User registration and login with JWT-based authentication.
- **Protected Access:** Authentication checks for protected application routes and API requests.
- **Dashboard:** View project and task information.
- **Project Management:** Create, view, update, and manage projects.
- **Task Management:** Manage tasks and update task information and status.
- **Database Integration:** Store and retrieve application data using MongoDB and Mongoose.
- **REST APIs:** Handle application data through server-side API routes.
- **Responsive UI:** A dashboard interface with reusable components and navigation.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React.js | User interface and components |
| JavaScript | Application logic |
| MongoDB Atlas | Database |
| Mongoose | MongoDB models and database operations |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Git & GitHub | Version control |
| Vercel | Deployment |

## Application Architecture

The application uses the following high-level flow:

1. **Frontend:** React components render the dashboard, projects, and tasks.
2. **API layer:** Next.js API routes process client requests.
3. **Authentication:** JWT-based authentication identifies the logged-in user.
4. **Database layer:** Mongoose connects the application to MongoDB.
5. **Persistence:** Project and task data is stored in the database.

## Authentication

The authentication flow includes:

- User registration
- Login and password verification
- JWT token generation and verification
- HTTP-only cookie-based session handling
- Current-user endpoint
- Logout functionality
- Protected routes and authenticated API requests

Passwords should be stored as hashes, never as plain text. Authentication secrets and database credentials must be configured through environment variables.

## API Overview

The following table describes the expected API structure. Confirm each route and HTTP method against the actual files in `src/app/api` before treating this table as a complete API reference.

| Endpoint | Methods | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Register a user |
| `/api/auth/login` | POST | Authenticate a user |
| `/api/auth/me` | GET | Retrieve the current user |
| `/api/auth/logout` | POST | End the authenticated session |
| `/api/projects` | GET, POST | Retrieve and create projects |
| `/api/projects/[id]` | GET, PUT, DELETE | Retrieve, update, or delete a project |
| `/api/tasks` | GET, POST | Retrieve and create tasks |
| `/api/tasks/[id]` | PUT, DELETE | Update or delete a task |

Actual endpoints and supported methods may differ depending on the current implementation.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js
- npm
- Git
- A MongoDB database, such as MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/Shivangi-30/project-management-saas.git
```

### 2. Open the project directory

```bash
cd project-management-saas
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the example values with your own credentials.

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: A strong, private secret used to sign and verify JWTs.

**Security:** Never commit `.env.local` or expose database credentials and JWT secrets in source code. Keep environment files excluded through `.gitignore`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Project Structure

The main application code is organized within `src`:

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   ├── components/
│   ├── dashboard/
│   ├── projects/
│   ├── settings/
│   └── tasks/
├── context/
└── lib/
```

- `src/app/api/` — Server-side API routes.
- `src/app/components/` — Reusable UI components.
- `src/app/dashboard/` — Dashboard interface.
- `src/app/projects/` — Project pages and details.
- `src/app/tasks/` — Task management interface.
- `src/context/` — Shared application state.
- `src/lib/` — Database and authentication utilities.

## Learning Outcomes

This project provides practical experience with:

- Next.js App Router
- React components and shared state
- REST API design and CRUD operations
- MongoDB and Mongoose integration
- Authentication and password hashing
- Environment variable management
- Git, GitHub, and deployment workflows

## Future Improvements

- Expand automated testing and API validation.
- Improve error handling and loading states.
- Add pagination and advanced task filters.
- Improve accessibility and responsive behavior.
- Strengthen authorization and input validation.

## Author

**Shivangi Gupta** — Frontend Developer

- **GitHub:** [Shivangi-30](https://github.com/Shivangi-30)
- **LinkedIn:** [Shivangi Gupta](https://www.linkedin.com/in/shivangi-gupta-103753256/)
- **Portfolio:** [View Portfolio](https://shivangi-s-portfolio.vercel.app)

---

This project is part of my journey toward building production-ready web applications with React, Next.js, and backend technologies.
