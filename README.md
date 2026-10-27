# StaffSync — HR & Team Operations Portal

**Student project owner:** Aadesh Shrivastava  
**Project type:** Full-stack web application  
**Stack:** React, Vite, Bootstrap, Express, MongoDB, Mongoose, JWT

StaffSync brings common people-operations workflows into one role-aware workspace. HR users manage staff records and company-wide updates, managers handle team workflows, and employees can manage their own attendance, leave requests, profile, and training information.

> **Project note:** This repository is being prepared as a student project. Review the code, understand each module, and record any additional changes you make before submitting or presenting it.

## Main workflows

- **Role-based access:** separate HR, manager, and employee views using JWT authentication.
- **Staff directory:** search staff by name, email, department, or position; HR can create and update records.
- **Directory CSV export:** HR can export the currently filtered directory to a UTF-8 CSV file for spreadsheet review. This is a project-specific enhancement; exported columns exclude salary and password data.
- **Leave management:** employees submit requests and authorized managers/HR review them.
- **Attendance:** employees check in/out and review their attendance history.
- **Announcements:** HR publishes updates for the organization.
- **Training:** managers and HR can publish training opportunities.
- **Profile management:** users can maintain their personal details.

## Requirements

- Node.js 18 or newer (recommended)
- npm
- MongoDB local instance or a MongoDB Atlas database

## Run locally

### 1. Configure the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set `MONGO_URI` to your MongoDB connection string and `JWT_SECRET` to a long, random secret. Never commit `.env` or production credentials.

### 2. Seed demo data (optional)

With MongoDB available and `.env` configured:

```bash
npm run seed
```

The seed script resets the demo users and announcements in the configured database. **Do not run it against a database containing real data.**

### 3. Start the API

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default.

### 4. Start the frontend in a second terminal

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite. If needed, check `client/vite.config.js` for the development API proxy.

## Demo accounts

After running the seed script, use these local demo accounts:

| Role | Email | Password |
|---|---|---|
| HR | `hr@staffsync.com` | `hr1234` |
| Manager | `manager@staffsync.com` | `mgr1234` |
| Employee | `employee@staffsync.com` | `emp1234` |

These are sample credentials only. Change or remove them before exposing a deployment publicly.

## API overview

API routes are mounted under `/api` and protected routes require `Authorization: Bearer <token>`.

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Users: `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`, `PUT /api/users/me/profile`
- Leaves: `POST /api/leaves`, `GET /api/leaves/mine`, `GET /api/leaves`, `PUT /api/leaves/:id/status`
- Attendance: `POST /api/attendance/checkin`, `POST /api/attendance/checkout`, `GET /api/attendance/mine`, `GET /api/attendance`
- Announcements: `GET /api/announcements`, `POST /api/announcements`, `DELETE /api/announcements/:id`
- Training: `GET /api/trainings`, `POST /api/trainings`, `DELETE /api/trainings/:id`

## Build check

```bash
cd client
npm install
npm run build
```

## Before deploying

1. Create a MongoDB Atlas database or provision MongoDB on a trusted server.
2. Configure `MONGO_URI` and a strong `JWT_SECRET` as deployment environment variables.
3. Restrict database network access as tightly as your hosting setup permits.
4. Replace or disable demo accounts and review role-based permissions.
5. Test login, employee management, leave approval, attendance, announcements, training, and CSV export on the deployed URL.
6. Do not upload `.env`, API keys, or database credentials to GitHub.

## Project-specific change log

- Added a CSV export action to the HR staff directory. The export follows the active search filter, includes staff contact/role/team fields, and deliberately omits salary and authentication information.
- Reworked the project documentation for setup, safe demo seeding, API routes, and deployment preparation.
