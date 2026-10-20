# UniPrep AI --- Project Documentation

**AI-Powered University Exam Preparation Platform**

UniPrep AI is a full-stack web application designed to help university
students organize exam-preparation resources, access notes and
previous-year question papers (PYQs), ask academic questions through an
AI chat interface, and practice with interactive mock tests.

-   **GitHub repository:**
    https://github.com/nandinidighde1646-source/uniPrep-ai
-   **Application type:** Full-stack web application
-   **Frontend:** React, TypeScript, Vite, Tailwind CSS
-   **Backend:** Node.js, Express, TypeScript
-   **Database:** PostgreSQL with Prisma ORM

> Project status: The code is maintained in the GitHub `main` branch.
> Configure production services and environment variables before
> describing the application as deployed.

------------------------------------------------------------------------

## Contents

1.  [Objectives](#1-objectives)
2.  [Features](#2-features)
3.  [Technology Stack](#3-technology-stack)
4.  [Architecture](#4-architecture)
5.  [Project Structure](#5-project-structure)
6.  [Prerequisites](#6-prerequisites)
7.  [Local Setup](#7-local-setup)
8.  [Environment Variables](#8-environment-variables)
9.  [Database and Prisma](#9-database-and-prisma)
10. [Application Routes](#10-application-routes)
11. [API Reference](#11-api-reference)
12. [Authentication and Roles](#12-authentication-and-roles)
13. [Mock Test Workflow](#13-mock-test-workflow)
14. [PDF Uploads and Storage](#14-pdf-uploads-and-storage)
15. [Build and Verification](#15-build-and-verification)
16. [Deployment Notes](#16-deployment-notes)
17. [Security and Operational Notes](#17-security-and-operational-notes)
18. [Possible Future Improvements](#18-possible-future-improvements)

------------------------------------------------------------------------

## 1. Objectives

UniPrep AI aims to:

-   Keep exam-preparation resources in one place.
-   Organize notes and PYQs by subject, semester, branch, and relevant
    metadata.
-   Provide an AI chat interface for academic doubts and explanations.
-   Give students a way to practice timed mock tests and review results.
-   Provide administrators with controlled resource and mock-test
    management.
-   Demonstrate practical full-stack development, REST API design,
    database modeling, authentication, and role-based access control.

## 2. Features

### Student features

-   Register and log in to the application.
-   Access a student dashboard.
-   Browse and filter study notes.
-   Browse and filter previous-year question papers.
-   Open or download available PDF resources.
-   Ask academic questions through the UniPrep AI chat interface.
-   Browse published mock tests.
-   Attempt tests with multiple-choice questions and a timer.
-   Submit answers and view test results and explanations when provided.
-   View and manage profile information supported by the application.

### Administrator features

-   Access a protected administration area.
-   Manage notes and PYQ resources.
-   Upload PDF files through supported upload forms.
-   Create mock tests and add multiple-choice questions.
-   Add questions in bulk using the supported question-import format.
-   Publish or unpublish mock tests.
-   Delete mock tests.
-   Manage users through the administration interface.

**Note:** The exact fields and behavior depend on the current
implementation. Verify the application UI and API before treating this
list as a formal acceptance-test checklist.

## 3. Technology Stack

  Area                           Technology
  ------------------------------ -------------------------------
  Frontend framework             React
  Frontend language              TypeScript
  Frontend build tool            Vite
  Styling                        Tailwind CSS
  Client-side routing            React Router
  HTTP requests                  Axios
  Icons                          Lucide React
  Notifications                  React Hot Toast
  Markdown rendering             React Markdown
  Backend runtime                Node.js
  Backend framework              Express
  Backend language               TypeScript
  ORM and migrations             Prisma ORM
  Database                       PostgreSQL
  Authentication                 JSON Web Tokens (JWT)
  Password hashing               bcrypt
  AI integration                 Google GenAI SDK
  Optional storage integration   Supabase client/configuration

Dependencies can change. The `package.json` and lock files in the
repository are the source of truth for installed versions.

## 4. Architecture

The application uses a frontend/backend architecture:

``` text
Student or Administrator
          |
          v
React + TypeScript Frontend
          |
          | HTTP requests / JSON / multipart form data
          v
Express + TypeScript REST API
          |
          +---- Authentication and role checks
          |
          +---- Application services
          |          |
          |          v
          |      Prisma ORM
          |          |
          |          v
          |      PostgreSQL
          |
          +---- AI provider integration
          |
          +---- PDF / file storage integration
```

### Request flow

1.  A user interacts with a page in the React frontend.
2.  The frontend sends a request to the backend using Axios.
3.  Protected requests include the user's JWT in the authorization
    header.
4.  Backend middleware validates authentication and, where required, the
    user's role.
5.  Controllers validate and process the request, then call service
    functions.
6.  Prisma communicates with PostgreSQL for database operations.
7.  The backend returns a JSON response or an appropriate error.
8.  The frontend displays the result to the user.

## 5. Project Structure

The main project layout is:

``` text
UniPrep AI/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.ts
│   ├── uploads/
│   ├── .env                 # Local only; do not commit
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── .env                 # If used; local only
│   ├── package.json
│   └── vite.config.ts
├── backups/                 # Local database backups; do not commit
├── .gitignore
└── README.md
```

This is a high-level map; some files and directories may differ as
development continues.

### Backend organization

-   **`routes/`** --- maps HTTP methods and paths to controllers.
-   **`controllers/`** --- handles HTTP request/response behavior.
-   **`services/`** --- contains application and data-access logic.
-   **`middlewares/`** --- handles concerns such as authentication,
    authorization, and uploads.
-   **`config/`** --- initializes integrations and configuration.
-   **`prisma/schema.prisma`** --- defines database models and
    relations.
-   **`prisma/migrations/`** --- records database schema migrations.

### Frontend organization

-   **`pages/`** --- page-level screens, including mock-test and
    administration pages.
-   **`components/`** --- reusable UI components.
-   **`layouts/`** --- shared page layouts.
-   **`routes/`** --- application route definitions and route guards.
-   **`services/`** --- API client and request functions.
-   **`data/`** --- shared or static UI data.

## 6. Prerequisites

Install the following before running the project locally:

-   Node.js and npm.
-   PostgreSQL.
-   Git.
-   A code editor such as Visual Studio Code.

You will also need valid credentials for the external services enabled
in your configuration, such as the AI provider and optional file storage
provider.

Check installed versions:

``` powershell
node --version
npm --version
git --version
```

## 7. Local Setup

### 7.1 Clone the repository

``` powershell
git clone https://github.com/nandinidighde1646-source/uniPrep-ai.git
cd uniPrep-ai
```

### 7.2 Install backend dependencies

``` powershell
cd backend
npm install
```

Create `backend/.env` using the variables described in the next section.
Do not commit this file.

### 7.3 Configure PostgreSQL

Create a PostgreSQL database for local development, for example:

``` sql
CREATE DATABASE uniprep_ai;
```

Update `DATABASE_URL` in `backend/.env` with the correct database
username, password, host, port, and database name.

### 7.4 Apply database migrations

From the `backend` directory:

``` powershell
npx prisma generate
npx prisma migrate deploy
```

For a new local development migration, use
`npx prisma migrate dev --name descriptive_name` only after reviewing
the schema and ensuring a suitable backup exists.

Do not use `prisma migrate reset` on a database containing data you need
to keep.

### 7.5 Start the backend

``` powershell
npm run dev
```

The development API has been configured to use port `5000` in the local
setup. Confirm the startup message and actual port in the current server
configuration.

### 7.6 Install and start the frontend

Open a second terminal:

``` powershell
cd frontend
npm install
npm run dev
```

Vite commonly starts at `http://localhost:5173`. If that port is busy,
Vite may select another port and print it in the terminal.

Open the URL printed by Vite.

## 8. Environment Variables

Create environment files locally. The exact required variables depend on
the current backend code; keep all secrets out of source control.

### Backend --- `backend/.env`

Example template (replace placeholders with your own values):

``` dotenv
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/uniprep_ai?schema=public"

JWT_SECRET="replace_with_a_long_random_secret"

GEMINI_API_KEY="your_ai_provider_api_key"

SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SECRET_KEY="your_supabase_secret_key"
```

Important:

-   The AI key name must match the name read by the current AI service.
-   `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are read by the Supabase
    configuration file included in the project. If that integration is
    enabled, both values are required.
-   Do not expose a Supabase secret/service-role key in frontend
    variables or browser code.
-   If a provider is not used by the deployed application, do not
    configure it unnecessarily.
-   Never publish real passwords, JWT secrets, database URLs, or API
    keys.

### Frontend --- environment configuration

If the frontend API client supports a configurable base URL, configure
the variable name that the current code reads. For example, a Vite
application often uses:

``` dotenv
VITE_API_BASE_URL="http://localhost:5000"
```

**Verify the actual variable name in `frontend/src/services/api.ts`
before using this example.** Vite exposes `VITE_*` variables to
client-side code, so they must never contain secrets.

After changing frontend environment variables, restart the Vite server.

## 9. Database and Prisma

Prisma defines the database schema and manages schema migrations.
PostgreSQL stores application data.

### Schema management

-   Review `backend/prisma/schema.prisma` for the current model
    definitions.
-   Review migration SQL under `backend/prisma/migrations/`.
-   Run `npx prisma generate` after schema changes when required.
-   Use versioned migrations to apply schema changes consistently across
    environments.

### Mock tests

The project includes a migration for mock-test functionality. Its schema
supports mock tests, questions, user attempts, and submitted answers.
Refer to the actual Prisma schema and migration for the authoritative
fields and relationships.

### Local versus production data

Git tracks source code and migrations; it does **not** automatically
transfer rows from the local PostgreSQL database to a production
database.

To preserve selected local content, create a deliberate data migration,
seed script, or reviewed database export/import process. Do not upload
raw database backups to a public repository.

## 10. Application Routes

The following routes are part of the frontend routing structure:

  ----------------------------------------------------------------------------------
  Route                              Purpose                 Access
  ---------------------------------- ----------------------- -----------------------
  `/`                                Home page               Public or
                                                             application-defined

  `/dashboard`                       Student dashboard       Authenticated

  `/profile`                         User profile            Authenticated

  `/mock-tests`                      Published mock-test     Authenticated
                                     list                    

  `/mock-tests/:id`                  Attempt a mock test     Authenticated

  `/mock-tests/results/:attemptId`   View an attempt result  Authenticated

  `/admin`                           Administration          Admin
                                     dashboard               

  `/admin/notes`                     Manage notes            Admin

  `/admin/pyqs`                      Manage PYQs             Admin

  `/admin/mock-tests`                Manage mock tests       Admin

  `/admin/users`                     Manage users            Admin
  ----------------------------------------------------------------------------------

Authentication and route guards should be checked in the current router
before treating this table as a complete access-control specification.

## 11. API Endpoints

The API uses the `/api` prefix in the current frontend/backend setup.
The endpoints below document the mock-test routes implemented in the
project; inspect the route files for current request fields and response
formats.

### Mock tests --- student endpoints

  ----------------------------------------------------------------------------------------------
  Method                  Endpoint                                       Purpose
  ----------------------- ---------------------------------------------- -----------------------
  `GET`                   `/api/mock-tests`                              List published mock
                                                                         tests

  `GET`                   `/api/mock-tests/:id`                          Retrieve a mock test

  `POST`                  `/api/mock-tests/:id/attempts`                 Start an attempt

  `POST`                  `/api/mock-tests/attempts/:attemptId/submit`   Submit an attempt

  `GET`                   `/api/mock-tests/attempts/:attemptId/result`   Retrieve attempt
                                                                         results
  ----------------------------------------------------------------------------------------------

### Mock tests --- administrator endpoints

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  `GET`                   `/api/mock-tests/admin/all`     List mock tests for
                                                          administration

  `POST`                  `/api/mock-tests`               Create a mock test

  `PATCH`                 `/api/mock-tests/:id/publish`   Change publication
                                                          status

  `DELETE`                `/api/mock-tests/:id`           Delete a mock test
  -------------------------------------------------------------------------------

These endpoints require the relevant authentication and authorization
checks. Exact request bodies and validation rules are defined in the
backend route, controller, and service files.

### Other API areas

The application also contains route modules for authentication, notes,
PYQs, users, and AI chat. Check `backend/src/app.ts` and the
corresponding files in `backend/src/routes/` for the complete and
current API surface.

The AI chat frontend sends a message and conversation history to
`/api/ai/chat` in the current implementation.

## 12. Authentication and Roles

The application uses JWT-based authentication and role-based access
control.

### Authentication

1.  A user signs in through the authentication API.
2.  The backend validates credentials.
3.  Passwords are intended to be stored as hashes rather than plaintext.
4.  The frontend stores the returned token according to the current
    authentication implementation.
5.  Axios includes the token in the `Authorization: Bearer <token>`
    header for protected requests.
6.  Backend authentication middleware verifies the token and attaches
    the authenticated user information to the request.

### Roles

-   **USER** --- accesses student-facing functionality and published
    learning resources.
-   **ADMIN** --- accesses protected administration features for
    managing supported resources and mock tests.

Hiding an admin link in the frontend is not sufficient security. The
backend must enforce admin authorization for every protected
administrative operation.

## 13. Mock Test Workflow

The mock-test feature supports an administrator-to-student workflow.

### Administrator workflow

1.  Open the Admin Panel.
2.  Navigate to Manage Mock Tests.
3.  Enter the test details.
4.  Add multiple-choice questions, options, correct answers,
    explanations, and marks as supported by the form.
5.  Optionally use the bulk-question parser and review its preview and
    validation errors.
6.  Save the test.
7.  Publish it when it is ready for students.

### Student workflow

1.  Open Mock Tests.
2.  Select an available published test.
3.  Start an attempt.
4.  Answer questions before the timer expires.
5.  Submit the attempt.
6.  Open the result page to review the score and available answer
    explanations.

### Bulk question format

The parser in the administration page uses question blocks beginning
with `Q:` and recognizes fields such as `Q`, `A`, `B`, `C`, `D`,
`Answer`, `Explanation`, and `Marks`.

Example:

``` text
Q: Which keyword is used to inherit a class in Java?
A: implements
B: extends
C: import
D: package
Answer: B
Explanation: The extends keyword is used for class inheritance in Java.
Marks: 1
```

Use the format and validation rules shown in the current Manage Mock
Tests interface. Preview imported questions and resolve validation
errors before adding them to the form.

## 14. PDF Uploads and Storage

The notes and PYQ workflows support PDF uploads through the
administration interface. The backend upload middleware validates PDF
files and uses server-side upload directories in the current local
implementation.

Operational considerations:

-   Uploaded PDFs are separate from the Git repository.
-   Keep upload directories out of source control.
-   A local upload directory may be temporary or non-persistent on a
    cloud hosting platform.
-   Before production deployment, configure durable storage and confirm
    that stored file URLs remain accessible.
-   If Supabase Storage is used, configure the correct bucket,
    permissions, and server-side credentials. A configuration file alone
    does not prove that all upload and retrieval paths have been
    migrated to Supabase.
-   Validate file type and size on the server; do not rely only on
    browser-side checks.

## 15. Build and Verification

Run the following checks before committing changes or deploying.

### Backend TypeScript build

``` powershell
cd backend
npm run build
```

### Frontend production build

``` powershell
cd frontend
npm run build
```

A successful frontend build creates the production assets in
`frontend/dist/`.

A Vite warning about a large JavaScript chunk does not necessarily mean
the build failed. Review the final exit status and any TypeScript or
bundling errors.

### Git verification

From the repository root:

``` powershell
git status
git diff --check
git diff --cached --check
```

Before committing, verify that `.env` files, uploaded PDFs, database
dumps, and temporary backups are not staged.

## 16. Deployment Notes

Deployment requires separately configured frontend hosting, backend
hosting, a production PostgreSQL database, and persistent file storage
where uploads are enabled.

### Production checklist

-   [ ] Create a production PostgreSQL database.
-   [ ] Configure the backend's production environment variables.
-   [ ] Apply versioned migrations using `npx prisma migrate deploy`.
-   [ ] Generate Prisma Client as required by the deployment build.
-   [ ] Deploy the Express API.
-   [ ] Configure production CORS to allow the deployed frontend origin.
-   [ ] Configure the frontend API base URL to point to the deployed
    backend.
-   [ ] Deploy the frontend static build.
-   [ ] Configure persistent PDF storage.
-   [ ] Configure the AI provider credentials and usage limits.
-   [ ] Create or migrate any required admin account securely.
-   [ ] Import only the reviewed data required in production.
-   [ ] Test registration, login, protected APIs, PDF access, AI chat,
    mock-test submission, and result retrieval.

**Deployment is not complete merely because the repository is on
GitHub.** Verify each deployed service and test the live application
before sharing a production URL.

## 17. Security and Operational Notes

-   Never commit `.env` files or credentials.
-   Use strong, unique JWT secrets in production.
-   Use HTTPS for production traffic.
-   Store passwords using a suitable password-hashing algorithm.
-   Validate incoming data on the backend.
-   Apply authentication and role checks to protected endpoints.
-   Restrict CORS to trusted frontend origins in production.
-   Keep dependencies updated and review security advisories.
-   Protect database backups and keep them outside public version
    control.
-   Avoid logging passwords, access tokens, or secret keys.
-   Apply request limits and file-size limits appropriate for the
    deployment.
-   Review AI-provider usage, quotas, and error handling.
-   Configure persistent storage for uploaded PDFs and test retrieval
    after redeployment.

## 18. Possible Future Improvements

Potential next steps include:

-   Search and filtering improvements across subjects, semesters, and
    branches.
-   Analytics for mock-test scores and performance over time.
-   Question tagging by topic and difficulty.
-   Better validation and reporting for bulk imports.
-   Automated backend API tests and frontend component tests.
-   CI checks for builds and migrations.
-   Improved API documentation with example request and response
    payloads.
-   Durable object storage for notes and PYQ PDFs.
-   Production monitoring, structured logging, and error reporting.
-   Accessibility and responsive-design testing.
-   Rate limiting and additional security hardening.

------------------------------------------------------------------------

## Author

**UniPrep AI** --- a full-stack academic project focused on exam
preparation, AI-assisted learning, resource management, and online mock
testing.

Repository: https://github.com/nandinidighde1646-source/uniPrep-ai

------------------------------------------------------------------------

*Documentation note: Keep this README synchronized with the actual
codebase. The Prisma schema, route files, package manifests,
environment-variable reads, and deployment configuration are the source
of truth for implementation details.*


#Admin id - artesting001@gmail.com
password - 123456

Live website - https://uni-prep-4fwy6m9vq-nandinidighde1646-source.vercel.app?utm_source=chatgpt.com

GitHub Repository - https://github.com/nandinidighde1646-source/uniPrep-ai?utm_source=chatgpt.com

Backend - Render - https://uniprep-ai-backend.onrender.com?utm_source=chatgpt.com