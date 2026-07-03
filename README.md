# Contact Manager API 📇

A RESTful backend API for managing personal contacts, built with **Node.js**, **Express**, and **MongoDB**. Each user registers/logs in and manages their own private list of contacts, secured with JWT authentication.

> **Status:** Backend only. No frontend/client is included in this repo yet.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [User](#user-apiusers)
  - [Contacts](#contacts-apicontacts)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Known Issues / Roadmap](#known-issues--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User authentication** — register/login with hashed passwords (bcrypt) and JWT access tokens
- **Per-user contact isolation** — each user only sees and manages their own contacts
- **Contact management** — full CRUD (create, read, update, delete) for contacts
- **Ownership checks** — updating or deleting a contact verifies the requester owns it
- **Centralized error handling** — consistent JSON error responses via a custom error handler

## Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| Runtime           | Node.js                              |
| Framework         | Express.js                           |
| Database          | MongoDB                              |
| ODM               | Mongoose                             |
| Auth              | JSON Web Tokens (`jsonwebtoken`)     |
| Password hashing  | bcrypt                               |
| Async error handling | express-async-handler             |
| Env config        | dotenv                               |

## Project Structure

```
ContactManager-API/
├── Config/
│   └── dbConnection.js         # MongoDB connection
├── Controllers/
│   ├── contactController.js    # Contact CRUD logic
│   └── userController.js       # Register / login / current user
├── middleware/
│   ├── errorHandler.js         # Centralized error responses
│   └── validateTokenHandler.js # JWT verification
├── models/
│   ├── contactModel.js
│   └── userModel.js
├── routes/
│   ├── contactRoutes.js
│   └── userRoutes.js
├── constant.js                 # HTTP status code constants
├── server.js                   # App entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ContactManager-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** — see [Environment Variables](#environment-variables) below.

4. **Run the server**
   ```bash
   node server.js
   ```
   or, with auto-restart on file changes (requires `nodemon`):
   ```bash
   nodemon server.js
   ```

   By default the server runs on **`http://localhost:8000`** (or the port set in `PORT`).

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
CONNECTION_STRING=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
```

| Variable               | Required | Description                                     |
|--------------------------|----------|---------------------------------------------------|
| `PORT`                  | No       | Port the server listens on (defaults to 8000)     |
| `CONNECTION_STRING`     | Yes      | MongoDB connection string                          |
| `ACCESS_TOKEN_SECRET`   | Yes      | Secret used to sign/verify JWT access tokens       |

## API Reference

All endpoints are prefixed by the base URL, e.g. `http://localhost:8000`.

> 🔒 = requires `Authorization: Bearer <token>` header

### User (`/api/users`)

| Method | Endpoint             | Description                    | Body                            |
|--------|------------------------|----------------------------------|------------------------------------|
| POST   | `/api/users/register`  | Register a new user              | `username, email, password`        |
| POST   | `/api/users/login`     | Log in and receive an access token | `email, password`                |
| GET    | `/api/users/current` 🔒 | Get the logged-in user's info    | —                                    |

### Contacts (`/api/contacts`)

All contact routes require authentication.

| Method | Endpoint                | Description                          | Body / Params            |
|--------|---------------------------|-----------------------------------------|-----------------------------|
| GET    | `/api/contacts` 🔒         | Get all contacts for the logged-in user | —                            |
| POST   | `/api/contacts` 🔒         | Create a new contact                     | `name, email, phone`         |
| GET    | `/api/contacts/:id` 🔒     | Get a single contact by ID               | `id` (URL param)             |
| PUT    | `/api/contacts/:id` 🔒     | Update a contact (owner only)            | `id` (URL param), fields to update |
| DELETE | `/api/contacts/:id` 🔒     | Delete a contact (owner only)            | `id` (URL param)             |

## Data Models

**User** — `username`, `email` (unique), `password` (hashed)

**Contact** — `user_id` (ref User, owner of the contact), `name`, `email`, `phone`

## Authentication

- Passwords are hashed with **bcrypt** before storage.
- On login, a JWT **access token** is issued (expires in 15 minutes) containing the user's `id`, `username`, and `email`.
- Protected routes expect `Authorization: Bearer <token>`; `validateTokenHandler` verifies the token and attaches the decoded user to `req.user`.
- Contact update/delete operations check that `contact.user_id` matches the requesting user before allowing the change.

## Error Handling

A centralized `errorHandler` middleware returns consistent JSON error responses, keyed off status codes defined in `constant.js`:

```json
{
  "title": "Validation Failed !!",
  "message": "All fields are mandatory!",
  "stackTrace": "..."
}
```

| Status | Meaning         |
|--------|------------------|
| 400    | Validation error |
| 401    | Unauthorized      |
| 403    | Forbidden         |
| 404    | Not found         |
| 500    | Server error      |

## Known Issues / Roadmap

- No frontend/client yet — this repo is backend-only.
- No automated tests are currently set up.
- `GET /api/contacts/:id` does not check contact ownership — any authenticated user can currently view any contact by ID (unlike update/delete, which do check). Consider adding the same ownership check here.
- Access tokens expire after 15 minutes with no refresh-token flow — consider adding one for a smoother client experience.
- Consider not returning `stackTrace` in error responses outside of development.

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and open a pull request.

## License

No license has been specified yet. Add a `LICENSE` file (e.g. MIT) if you intend this project to be open source.
