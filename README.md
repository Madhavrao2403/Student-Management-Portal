# Student Management Portal

A full-stack student management system with a React/Vite frontend and a Spring Boot backend. The application provides role-based access for administrators and students, JWT authentication, student profile management, and academic/financial information tracking.

## Features

### Authentication and authorization

- JWT-based login authentication
- BCrypt password hashing
- Role-based access for `ADMIN` and `STUDENT` users
- Protected frontend routes
- Stateless Spring Security configuration

### Admin capabilities

- View all students
- Create student accounts and profiles
- Update student information
- Delete students and their associated user accounts
- Manage academic, contact, guardian, financial, and document information

### Student capabilities

- Access a protected student dashboard
- View and manage student profile information exposed by the application
- Access student-specific API endpoints

### Student information managed

- Personal details
- Academic details and performance
- Contact and address information
- Parent/guardian information
- Emergency contacts
- Fees and payment status
- Document verification details
- Profile image data

## Technology stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Chart.js and `react-chartjs-2`
- CSS

### Backend

- Java 17
- Spring Boot 3.5.6
- Spring Web
- Spring Data JPA
- Spring Security
- JSON Web Tokens (JJWT)
- Lombok
- Maven

### Database

- MySQL

## Project structure

```text
Student-Management-Portal/
├── sms-backend/
│   ├── src/main/java/com/sms/
│   │   ├── config/          # Spring Security and application configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Request and response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── filter/          # JWT authentication filter
│   │   ├── repository/      # Spring Data repositories
│   │   ├── service/         # Business logic
│   │   └── util/            # JWT and utility classes
│   └── src/main/resources/
│       └── application.properties
└── student-management-frontend/
    ├── src/
    │   ├── components/      # React components and dashboards
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Prerequisites

Install the following before running the project:

- Java 17 or later
- Maven 3.8 or later, or use the Maven wrapper if added to the project
- Node.js 18 or later and npm
- MySQL 8 or later

## Database setup

1. Start MySQL.
2. Create the application database:

   ```sql
   CREATE DATABASE student_management;
   ```

3. Configure the backend connection in `sms-backend/src/main/resources/application.properties`.

For local development, use environment-specific configuration rather than committing real credentials. At minimum, keep the database password and JWT secret outside source control and rotate any credentials that have previously been committed.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

jwt.secret=${JWT_SECRET}
```

The backend uses Hibernate's `ddl-auto=update` setting for development. Use a migration strategy and a safer schema policy for production deployments.

## Running the backend

From the repository root:

```bash
cd sms-backend
mvn spring-boot:run
```

The backend runs on the default Spring Boot port:

```text
http://localhost:8080
```

To build the backend:

```bash
mvn clean package
```

## Running the frontend

From the repository root:

```bash
cd student-management-frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

Available frontend commands:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## API overview

### Authentication

```text
POST /api/auth/login
POST /api/auth/register
```

Authenticated requests should include the JWT in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Administrator endpoints

```text
GET    /api/admin/students
POST   /api/admin/students
PUT    /api/admin/students/{id}
DELETE /api/admin/students/{id}
```

These endpoints require the `ADMIN` role.

### Student endpoints

Student-specific endpoints are available under:

```text
/api/students/**
```

These endpoints require either the `STUDENT` or `ADMIN` role, depending on the endpoint configuration.

### Security diagnostics

The project includes a diagnostic endpoint:

```text
GET /api/security/context
```

This endpoint is intended for development and debugging. Protect or remove it before deploying to production because it exposes authentication context details.

## Authentication flow

1. The frontend sends credentials to `POST /api/auth/login`.
2. The backend authenticates the user and returns a JWT with the username and role.
3. The frontend stores the token and role for route protection.
4. The frontend sends the token in the `Authorization` header for protected requests.
5. `JwtAuthenticationFilter` validates the token and adds the user's role to the Spring Security context.
6. Spring Security enforces access rules for administrator and student endpoints.

## Default student account behavior

When an administrator creates a student, the backend currently creates the associated user account with a default password. Change this behavior before production use by implementing a secure password setup or invitation flow and requiring users to change temporary passwords.

## CORS

The backend enables CORS for frontend development. Review the CORS configuration before production deployment and replace wildcard or local development origins with the exact trusted frontend origin.

## Troubleshooting

### Database connection errors

- Confirm that MySQL is running.
- Confirm that the `student_management` database exists.
- Check the username and password used by Spring Boot.
- Confirm that port `3306` is available.

### 401 Unauthorized responses

- Confirm that the login request returned a token.
- Send the token using `Authorization: Bearer <token>`.
- Check that the JWT secret is the same for token creation and validation.
- Verify that the token has not expired.

### 403 Forbidden responses

- Confirm that the user's role matches the endpoint requirement.
- Roles are represented as Spring authorities with the `ROLE_` prefix.
- For example, an administrator must have the `ROLE_ADMIN` authority.

### Frontend cannot reach the backend

- Confirm that the backend is running on port `8080`.
- Check the API base URL used by Axios.
- Review browser CORS errors and the backend CORS configuration.

## Security notes

- Do not commit database passwords, JWT secrets, or other credentials.
- Rotate credentials that have been exposed in repository history.
- Use strong, randomly generated JWT secrets in every environment.
- Avoid logging tokens, passwords, or sensitive student data.
- Disable or restrict debug endpoints in production.
- Use HTTPS when deploying outside a local development environment.
- Add validation and centralized error handling for public API requests.
- Consider database migrations instead of relying on `ddl-auto=update` in production.

## License

No license has been specified for this project yet.
