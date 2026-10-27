# StaffSync — HR & Team Operations Portal

A full-stack Human Resource Management System designed to streamline employee management, attendance tracking, leave approvals, and team communication through a centralized, role-based workspace.

<p align="center">
  <a href="https://staffsync-hr-portal.vercel.app/">
    <strong>🚀 Live Demo</strong>
  </a>
  &nbsp; • &nbsp;
  <a href="https://github.com/aadesh-shrivastava/staffsync-hr-portal">
    <strong>📂 Source Code</strong>
  </a>
</p>

---

## 📌 Overview

StaffSync is a web-based HR and team operations portal that brings essential workforce management workflows into one application.

The platform provides role-specific experiences for HR administrators, managers, and employees. HR teams can manage employee records and company-wide announcements, managers can handle team workflows, and employees can access their attendance, leave requests, profile, and training information.

The project demonstrates full-stack web development, REST API integration, database management, authentication, and cloud deployment.

**Project Owner:** Aadesh Shrivastava  
**Project Type:** Full-stack Web Application  
**Deployment:** Vercel  
**Database:** MongoDB Atlas

## ✨ Key Features

### 🔐 Authentication & Role-Based Access
- JWT-based authentication.
- Separate experiences for HR administrators, managers, and employees.
- Role-oriented access to application functionality.

### 👥 Employee Management
- Centralized staff directory.
- Search employees by name, email, department, or position.
- Create and update employee records.
- Export filtered staff directory results to CSV.
- Exports exclude salary and password information.

### 🗓️ Attendance Management
- Employee check-in and check-out.
- Attendance history for individual employees.
- Attendance information available through the HR interface.

### 📋 Leave Management
- Employees can submit leave requests.
- Authorized HR users and managers can review requests and update their status.
- Leave-related information is organized within the portal.

### 📢 Announcements
- HR can publish organization-wide announcements.
- Announcement data is stored in MongoDB.

### 🎓 Training Management
- HR and managers can publish training opportunities.
- Training information is accessible through the application.

### 👤 Profile Management
- Users can maintain their personal information through profile management functionality.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development server and build tooling |
| Bootstrap | Responsive UI styling |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API and routing |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Vercel | Cloud deployment |
| Git & GitHub | Version control |

---

## 🏗️ Architecture

StaffSync uses a frontend-backend-database architecture.

```text
                  ┌──────────────────────┐
                  │        Users         │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    React + Vite      │
                  │      Frontend        │
                  └──────────┬───────────┘
                             │
                       HTTP / REST API
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Node.js + Express   │
                  │      Backend         │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    MongoDB Atlas     │
                  │       Database       │
                  └──────────────────────┘
```

### Request Flow

1. Users interact with the React frontend.
2. The frontend sends API requests to the Express backend.
3. The backend handles authentication, authorization, application logic, and database operations.
4. MongoDB stores application data.
5. The API returns responses to the frontend for display.

---

## 📂 Project Structure

```text
staffsync-hr-portal/
│
├── client/                  # React + Vite frontend
│
├── server/                  # Express backend
│   ├── config/              # Database configuration
│   ├── routes/              # API route modules
│   ├── .env.example         # Environment variable template
│   └── server.js            # Backend entry point
│
├── api/
│   └── index.js             # Vercel API entry point
│
├── package.json             # Root configuration and scripts
├── vercel.json              # Deployment configuration
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run StaffSync locally.

### Prerequisites

- Node.js 18 or newer
- npm
- Git
- A local MongoDB instance or MongoDB Atlas database

### 1. Clone the Repository

```bash
git clone https://github.com/aadesh-shrivastava/staffsync-hr-portal.git
cd staffsync-hr-portal
```

### 2. Configure the Backend

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

Update `server/.env` with your own values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

**Security notes:**
- Replace the example values with your actual development credentials.
- Use a strong, randomly generated JWT secret.
- Never commit `.env` files or production credentials to GitHub.

### 3. Seed Demo Data (Optional)

Ensure MongoDB is available and the environment variables are configured.

From the `server` directory, run:

```bash
npm run seed
```

> **Warning:** The seed script resets the demo users and announcements in the configured database. Never run it against a database containing real or important data.

### 4. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend listens on `http://localhost:5000` by default.

### 5. Start the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, typically:

`http://localhost:5173`

If API requests fail during development, check `client/vite.config.js` for the configured API proxy.

---

## 🧪 Demo Accounts

After running the seed script against a development database, use the following sample accounts:

| Role | Email | Password |
|---|---|---|
| HR | `hr@staffsync.com` | `hr1234` |
| Manager | `manager@staffsync.com` | `mgr1234` |
| Employee | `employee@staffsync.com` | `emp1234` |

The deployed application also provides demo account options on its login page.

**Important:** These are demonstration credentials, not secure production credentials. Do not use them for accounts containing real employee information.

---

## 🔌 API Overview

The backend exposes REST API endpoints under the `/api` prefix.

Protected endpoints require authentication using a bearer token:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the current user's information |

### Users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | Retrieve user records |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| PUT | `/api/users/me/profile` | Update the current user's profile |

### Leave Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/leaves` | Submit a leave request |
| GET | `/api/leaves/mine` | Retrieve the current user's requests |
| GET | `/api/leaves` | Retrieve leave requests |
| PUT | `/api/leaves/:id/status` | Update a leave request's status |

### Attendance

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/attendance/checkin` | Record check-in |
| POST | `/api/attendance/checkout` | Record check-out |
| GET | `/api/attendance/mine` | Retrieve personal attendance records |
| GET | `/api/attendance` | Retrieve attendance records |

### Announcements

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/announcements` | Retrieve announcements |
| POST | `/api/announcements` | Create an announcement |
| DELETE | `/api/announcements/:id` | Delete an announcement |

### Training

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/trainings` | Retrieve training opportunities |
| POST | `/api/trainings` | Create a training opportunity |
| DELETE | `/api/trainings/:id` | Delete a training opportunity |

**Note:** The endpoint list documents the project's reported routes. Actual access permissions and request requirements are defined by the backend implementation.

---

## 🏗️ Production Build

To verify that the frontend builds successfully, run:

```bash
cd client
npm install
npm run build
```

Vite generates the production build in the `client/dist` directory by default.

---

## ☁️ Deployment

StaffSync is deployed on Vercel and uses MongoDB Atlas for cloud database storage.

- **Live application:** [staffsync-hr-portal.vercel.app](https://staffsync-hr-portal.vercel.app/)
- **Source code:** [GitHub Repository](https://github.com/aadesh-shrivastava/staffsync-hr-portal)

### Environment Variables

Configure the following variables in the deployment environment:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing and verification |

### Deployment Checklist

Before deploying changes:

1. Confirm the MongoDB connection string is correct.
2. Configure environment variables in the hosting platform.
3. Use a strong JWT secret.
4. Review database permissions and network access.
5. Verify role-based authorization on the backend.
6. Test login and all core workflows.
7. Confirm that no secrets or environment files are committed to GitHub.

---

## 🔒 Security Considerations

Because HR applications may handle sensitive employee information, security deserves particular attention.

- Passwords should be hashed before storage.
- Authentication secrets must remain outside source control.
- Protected API routes should enforce authentication and role-based authorization on the server.
- Database users should follow the principle of least privilege.
- Public demo environments should use test data.
- Database network access should be restricted wherever the hosting architecture permits.
- Input validation and error handling should be applied consistently.

StaffSync is a student portfolio project. Its suitability for real-world HR operations depends on the completeness of its security controls, testing, and operational safeguards.

---

## 🛣️ Potential Improvements

Future enhancements could include:

- Automated API and authentication tests.
- More comprehensive authorization checks.
- Attendance analytics and reporting.
- Email notifications for leave approvals and announcements.
- Audit logs for sensitive operations.
- Improved error monitoring and observability.
- CI/CD checks for builds and tests.
- More detailed dashboard analytics.

---

## 👨‍💻 Author

**Aadesh Shrivastava**  
B.Tech — Computer Science and Engineering

- **GitHub:** [@aadesh-shrivastava](https://github.com/aadesh-shrivastava)
- **Live Project:** [StaffSync HR Portal](https://staffsync-hr-portal.vercel.app/)

---

## 📄 License

No license has been specified for this repository. Unless an appropriate license is added, others should not assume they have permission to reuse, modify, or redistribute the source code.
