<div align="center">

# 🎓 Student Event Management System

**A full-stack microservices application for managing student event registrations with role-based access control.**

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)

</div>

---

## 📋 Overview

This is a microservices-based event management platform designed for academic institutions. Students can register for and track their event participations, while faculty members can manage and view registrations across their department — all secured by stateless JWT authentication.

The system is split into three independent backend microservices and a single React + TypeScript frontend, each with its own MongoDB database and responsibility boundary.

---

## ✨ Features

**For Students:**
- Register and log in securely with BCrypt-hashed passwords
- Add event registrations — both faculty-approved and external (self-organized) events
- View events split into upcoming and past, sorted by date
- Edit or delete only their own event records
- Protected routes ensure students can only access their own data

**For Faculty:**
- Separate login portal with faculty-specific JWT tokens
- Dashboard to view all student registrations filtered by month
- Add, edit, and delete event records on behalf of students
- Data scoped strictly to the faculty's own ID — no cross-faculty access

**Security throughout:**
- All sensitive routes protected via `JwtAuthFilter` (Spring Security)
- Stateless sessions — no server-side session storage
- Role claims embedded in JWT (`student` / `faculty`) and enforced per endpoint
- ID mismatch checks on every mutation (you can only touch your own data)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                    │
│                     localhost:5173                          │
│                                                             │
│  Pages: StudentLogin, StudentRegister, Events,             │
│         FacultyLogin, FacultyRegister, FacultyDashboard    │
│                                                             │
│  Services: api.ts (REST calls) | auth.ts (localStorage)   │
└───────────┬──────────────────┬────────────────┬────────────┘
            │                  │                │
            ▼                  ▼                ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────────┐
│ Student       │   │  Event          │   │  Faculty          │
│ Service       │   │  Service        │   │  Service          │
│ :8081         │   │  :8082          │   │  :8083            │
│               │   │                 │   │                   │
│ /students     │   │ /events         │   │ /faculty          │
│  /register    │   │  /add           │   │  /register        │
│  /login       │   │  /student/:rn   │   │  /login           │
│               │   │  /faculty/:id   │   │                   │
│ MongoDB:      │   │  /update/...    │   │ MongoDB:          │
│ ex-9          │   │  /delete/...    │   │ facultydb         │
│               │   │                 │   │                   │
│               │   │ MongoDB: ex-9   │   │                   │
└───────────────┘   └─────────────────┘   └───────────────────┘
        │                   │                      │
        └───────────────────┴──────────────────────┘
                            │
                    JWT Token (HMAC-256)
                    shared secret across
                    all services
```

### Key Architectural Decisions

**Microservices with shared JWT secret** — Each service independently validates the same JWT token using HMAC-256. This avoids a central auth service while keeping inter-service tokens consistent.

**Database-per-service** — Student Service and Event Service share a MongoDB instance (`ex-9`) but Faculty Service gets its own (`facultydb`). This maintains service boundaries while keeping the dev setup simple.

**Stateless API** — No sessions anywhere. Every request carries a `Bearer` token. Spring Security's `SessionCreationPolicy.STATELESS` is configured on all three services.

**Role enforcement at the controller layer** — Rather than just checking if a token is valid, every endpoint checks that the claimed role and ID in the token match what's being accessed. E.g., a student token cannot touch a faculty-scoped endpoint, and even if they had faculty role, the `facultyId` claim must match the path parameter.

**Frontend token storage** — JWTs are stored in `localStorage` and sent via the `Authorization: Bearer` header on every API call. An automatic redirect to `/` fires on any `401` response.

---

## 📦 Microservices

### 1. Student Service (`port 8081`)

Handles student registration and authentication.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/students/register` | POST | None | Register a new student |
| `/students/login` | POST | None | Authenticate and receive a JWT |
| `/students` | GET | JWT (any) | List all students |

**Token payload issued on login:**
```json
{
  "sub": "student@college.edu",
  "role": "student",
  "rollNumber": "22CS001",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Database:** `mongodb://localhost:27017/ex-9` → collection `students`

---

### 2. Event Service (`port 8082`)

Core business logic — manages event records. Validates JWT on every request and enforces ownership rules.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/events/add` | POST | JWT | Add an event (student or faculty) |
| `/events/student/:rollNumber` | GET | JWT (student) | Get all events for a student |
| `/events/faculty/:facultyId/:month` | GET | JWT (faculty) | Get events by faculty and month |
| `/events/update/:id/:facultyId` | PUT | JWT (faculty) | Update a faculty-owned event |
| `/events/student/update/:id/:rollNumber` | PUT | JWT (student) | Update a student-owned event |
| `/events/delete/:id/:facultyId` | DELETE | JWT (faculty) | Delete a faculty event |
| `/events/student/delete/:id/:rollNumber` | DELETE | JWT (student) | Delete a student event |

**Ownership enforcement example:**
```java
// In EventService.updateEvent()
if (!event.getFacultyId().equals(facultyId)) {
    throw new RuntimeException("Unauthorized");
}
```

**Month filtering:** Accepts both numeric (`5`) and named (`May`) months, normalized to ISO date string matching (`-05-`).

**External events:** Events where `facultyId` is null/blank are "external" (student self-registered events outside the faculty system).

**Database:** `mongodb://localhost:27017/ex-9` → collection `events`

---

### 3. Faculty Service (`port 8083`)

Handles faculty registration, authentication, and JWT issuance.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/faculty/register` | POST | None | Register a new faculty member |
| `/faculty/login` | POST | None | Authenticate and receive a JWT |

**Token payload issued on login:**
```json
{
  "sub": "faculty@college.edu",
  "role": "faculty",
  "facultyId": "FAC101",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Password handling:** Passwords are hashed using BCrypt on registration. A plain-text migration path is included for legacy records — it detects unhashed passwords on login and re-hashes them transparently.

**Database:** `mongodb://localhost:27017/facultydb` → collection `faculty`

---

## 🖥 Frontend

**Tech stack:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS 3, React Router 7

### Route Structure

```
/                            → StudentLogin
/register                    → StudentRegister
/faculty/login               → FacultyLogin
/faculty/register            → FacultyRegister
/student/events/:rollNumber  → Events         [Protected: student]
/faculty/dashboard           → FacultyDashboard [Protected: faculty]
*                            → 404 page
```

### Protected Routes

`ProtectedRoute` wraps sensitive routes and enforces two checks: the JWT must exist in `localStorage`, and the role claim must match `allowedRole`. Mismatched roles redirect to the correct home page for their role rather than a generic error.

```tsx
// Cross-role redirect logic
if (allowedRole && role !== allowedRole) {
  if (role === 'faculty') return <Navigate to="/faculty/dashboard" />;
  if (role === 'student') return <Navigate to={`/student/events/${rollNumber}`} />;
}
```

### Key Components

| Component | Purpose |
|---|---|
| `Navbar` | Adaptive nav — shows user name + role when authenticated, login links when not |
| `EventCard` | Renders event details; two variants (`student` / `faculty`) control what metadata is shown |
| `ProtectedRoute` | HOC that validates JWT + role before rendering outlet |

### State & Auth

```
auth.ts
├── setToken / getToken / removeToken    → localStorage: 'jwtToken'
├── setUserRole / getUserRole            → localStorage: 'userRole'
└── setUserInfo / getUserInfo            → localStorage: 'userInfo' (JSON)

api.ts
├── fetchWithAuth()                      → Injects Bearer token on every request
└── Auto-redirect to '/' on 401
```

### Event Display Logic

Events are split client-side into **Upcoming** and **Past** categories by comparing the event date against today's date (time-zeroed for fair day comparison). Both faculty and student views apply this split.

---

## 🔐 Security Model

```
JWT (HMAC-256, shared secret)
│
├── Issued by: Student Service (on /students/login)
│             Faculty Service (on /faculty/login)
│
├── Verified by: Event Service on every request
│               Student Service on protected routes
│               Faculty Service on protected routes
│
└── Claims checked:
    ├── role       → "student" | "faculty"
    ├── rollNumber (students only)
    └── facultyId  (faculty only)
```

Each controller's `requireRole()` method enforces the role claim:

```java
private void requireRole(JwtUser user, String role) {
    if (user == null || !user.getRole().equalsIgnoreCase(role)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
}
```

---

## 🚀 Getting Started

### Prerequisites

- Java 25 (JDK)
- Maven 3.9+
- MongoDB running locally on port `27017`
- Node.js 20+ and npm

### 1. Start MongoDB

```bash
mongod --dbpath /your/data/path
```

### 2. Configure the JWT Secret

Before running any service, open each `application.properties` and set **the same secret string** in all three:

```properties
app.jwt.secret=your-strong-secret-here
```

Files to update:
- `backend/student-service/src/main/resources/application.properties`
- `backend/event-service/src/main/resources/application.properties`
- `backend/faculty-service/src/main/resources/application.properties`

### 3. Start the Backend Services

Run each in a separate terminal:

```bash
# Terminal 1 — Student Service (port 8081)
cd backend/student-service
./mvnw spring-boot:run

# Terminal 2 — Event Service (port 8082)
cd backend/event-service
./mvnw spring-boot:run

# Terminal 3 — Faculty Service (port 8083)
cd backend/faculty-service
./mvnw spring-boot:run
```

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ⚙️ Configuration Reference

### Backend (`application.properties`)

**Student Service:**
```properties
spring.application.name=student-service
spring.data.mongodb.uri=mongodb://localhost:27017/ex-9
server.port=8081
app.jwt.secret=replace-with-strong-secret
app.jwt.expiration-ms=86400000
```

**Event Service:**
```properties
spring.application.name=event-service
spring.data.mongodb.uri=mongodb://localhost:27017/ex-9
server.port=8082
app.jwt.secret=replace-with-strong-secret
```

**Faculty Service:**
```properties
spring.application.name=faculty-service
spring.data.mongodb.uri=mongodb://localhost:27017/facultydb
server.port=8083
app.jwt.secret=replace-with-strong-secret
app.jwt.expiration-ms=86400000
```

### Frontend API Endpoints (`frontend/src/services/api.ts`)

```typescript
const STUDENT_API_URL = 'http://localhost:8081/students';
const EVENT_API_URL   = 'http://localhost:8082/events';
const FACULTY_API_URL = 'http://localhost:8083/faculty';
```

Update these constants if deploying to a non-local environment.

---

## 📊 Data Models

### Student (`ex-9.students`)
```typescript
{
  id:         string   // MongoDB ObjectId
  rollNumber: string   // Unique student identifier
  name:       string
  email:      string
  password:   string   // BCrypt hashed
}
```

### Faculty (`facultydb.faculty`)
```typescript
{
  id:          string
  facultyId:   string   // e.g. "FAC101"
  facultyName: string
  email:       string
  password:    string   // BCrypt hashed
}
```

### Event (`ex-9.events`)
```typescript
{
  id:          string
  studentName: string
  rollNumber:  string   // Ties event to a student
  eventName:   string
  location:    string
  date:        string   // ISO date string e.g. "2024-05-15"
  description: string
  facultyId:   string   // Null/blank = external (student self-registered) event
}
```

---

## 🗂 Project Structure

```
/
├── backend/
│   ├── student-service/
│   │   └── src/main/java/com/example/studentservice/
│   │       ├── StudentController/StudentController.java   # REST endpoints
│   │       ├── StudentModel/StudentModel.java             # MongoDB document
│   │       ├── StudentRepository/StudentRepository.java   # MongoRepository
│   │       ├── StudentService/StudentService.java         # Business logic + BCrypt
│   │       ├── dto/AuthResponse.java                      # Login response shape
│   │       └── security/
│   │           ├── JwtAuthFilter.java    # OncePerRequestFilter
│   │           ├── JwtUtil.java          # Token generation + verification
│   │           ├── JwtUser.java          # Decoded token principal
│   │           └── SecurityConfig.java   # Stateless Spring Security config
│   │
│   ├── event-service/
│   │   └── src/main/java/com/example/eventservice/
│   │       ├── controller/EventController.java   # All event CRUD + auth guards
│   │       ├── model/Event.java
│   │       ├── repository/EventRepository.java   # Custom findBy methods
│   │       ├── service/EventService.java         # Ownership validation + month logic
│   │       └── security/                         # JWT filter (verify-only, no issuance)
│   │
│   └── faculty-service/
│       └── src/main/java/com/example/facultyservice/
│           ├── controller/FacultyController.java  # Register + login
│           ├── model/Faculty.java
│           ├── repository/FacultyRepository.java
│           ├── service/FacultyService.java         # BCrypt + legacy migration
│           ├── dto/AuthResponse.java
│           └── security/
│               ├── JwtUtil.java    # Generates faculty tokens
│               └── SecurityConfig.java
│
└── frontend/
    └── src/
        ├── components/
        │   ├── EventCard.tsx        # Event display (student/faculty variants)
        │   ├── Navbar.tsx           # Adaptive navigation bar
        │   └── ProtectedRoute.tsx   # Role-based route guard
        ├── pages/
        │   ├── StudentLogin.tsx
        │   ├── StudentRegister.tsx
        │   ├── Events.tsx           # Student event CRUD page
        │   ├── FacultyLogin.tsx
        │   ├── FacultyRegister.tsx
        │   └── FacultyDashboard.tsx # Faculty month-filtered event view
        ├── services/
        │   ├── api.ts               # All HTTP calls, fetchWithAuth(), 401 handling
        │   └── auth.ts              # localStorage token read/write helpers
        └── types/
            ├── Event.ts
            ├── Student.ts
            └── Faculty.ts
```

---

## 🛠 Scripts

### Backend
```bash
cd backend/<service-name>
./mvnw spring-boot:run     # Start in dev mode
./mvnw clean package       # Build production JAR
./mvnw test                # Run unit tests
```

### Frontend
```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

---

## ⚠️ Important Notes

**All three backend services must be running simultaneously.** The frontend calls each service directly — there is no API gateway or reverse proxy.

**JWT secret must be identical across all services.** A token issued by the Faculty Service is validated by the Event Service using the same HMAC-256 secret. Mismatched secrets will cause all cross-service calls to return `401`.

**MongoDB databases are auto-created.** Both `ex-9` and `facultydb` will be created on first write. No migration scripts are needed.

---

## 📄 License

MIT License

---

<div align="center">
  <sub>Built with Spring Boot, React, and MongoDB.</sub>
</div>
