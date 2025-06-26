# Talent Insider – Practical Backend Test

This repository contains the implementation of a backend microservices system, built as part of the Talent Insider technical interview. The project includes:

- **User Service** – handles authentication, resume upload, profile, and user logs.
- **Company Service** – handles company registration and job postings.
- **API Gateway** – central access point to route requests to each microservice.

---

## Tech Stack

- Node.js + Express
- PostgreSQL (via Sequelize)
- JWT Authentication
- Multer for file uploads
- Nodemon for local development

---

## Folder Structure

```
.
├── SERVICE_USERS/
├── SERVICE_COMPANY/
├── SERVICE_GATEWAY/
```

---

## How to Run (Local Development)

Make sure you have:

- Node.js ≥ 16.x installed
- PostgreSQL running locally
- `.env` file properly configured in each service folder

### Install dependencies for each service and start each service in a separate terminal:

```bash
# Terminal 1: User Service (Port 5000)
cd SERVICE_USERS
npm install
nodemon src/app.js

# Terminal 2: Company Service (Port 4000)
cd SERVICE_COMPANY
npm install
nodemon src/app.js

# Terminal 3: Gateway Service (Port 3000)
cd SERVICE_GATEWAY
npm install
nodemon src/app.js
```

> You can use basic `node src/app.js` as fallback if `nodemon` is not installed globally.

---

## 📬 API Routes

| Route                  | Method | Description                                                      |
| ---------------------- | ------ | ---------------------------------------------------------------- |
| `/v1/auth/login`       | POST   | Login user to get bearer token                                   |
| `/v1/auth/signup`      | POST   | Register new user (with optionaly upload photo and resume)       |
| `/v1/auth/sendOtp`     | POST   | Send OTP for account activation                                  |
| `/v1/auth/resendOtp`   | POST   | Resend OTP for account activation                                |
| `/v1/auth/acceptOtp`   | POST   | Submit OTP for account activation                                |
| `/v1/users/`           | GET    | Get user data (auth & admin required)                            |
| `/v1/users/:id`        | GET    | Get user data (auth & admin required)                            |
| `/v1/users/:id`        | PUT    | Edit user data, include resume (auth required)                   |
| `/v1/users/:id/resume` | GET    | Get user all resume users (auth required)                        |
| `/v1/company/`         | GET    | Get company data (auth required & user access company required)  |
| `/v1/company/`         | POST   | Create company data (auth required)                              |
| `/v1/company/:id`      | PUT    | Edit company data (auth required & user access company required) |
| `/v1/jobs/`            | GET    | Get job data (auth required & user access company required)      |
| `/v1/jobs/`            | POST   | Create job data (auth required & user access company required)   |
| `/v1/jobs/:id`         | PUT    | Edit job data (auth required & user access company required)     |
| `/v1/jobs/apply`       | POST   | Create apply job data (auth required required)                   |
| `/v1/jobs/apply:id`    | PUT    | Edit apply job data (auth required required)                     |

---

## Notes

- This implementation is scoped for interview purposes and can be improved with logging, validation layers, and error handling middleware.
- Environment variables are required. You can refer to `.env.example` inside each service for guidance.
- Some modifications were made, including the addition of userLogs, userCookies, and userActivation tables, along with several data type adjustments. These are based on the assumption that the admin will handle monitoring and access control features according to the roles.
- Docker setup is not included in this submission because I currently do not have Docker installed on my machine, and due to time constraints, I was unable to configure it properly. All necessary environment variables are provided, and the application can be run with npm install and npm start for each service folder. All services have been developed and tested locally using Node.js and can be run manually with:

  - User Service → http://localhost:5000
  - Company Service → http://localhost:4000
  - Gateway → http://localhost:3000

- For testing the app, you can register a new account or can login as Admin with:
  - Email: admin@admin.com
  - Password: _secret123!@#_

---

## Author

Submitted by Eddy Nathansyah for Talent Insider technical test.
