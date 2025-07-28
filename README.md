
# Booking System API

This project is a robust RESTful API for a booking and reservation system, built with [NestJS](https://nestjs.com/). It follows modern software architecture principles, including Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS), to ensure a scalable, maintainable, and testable codebase.

## ✨ Features

*   **Booking Management**: Create, confirm, cancel, and retrieve bookings.
*   **Resource Availability**: Check for available resources within a given time slot.
*   **Race Condition Handling**: Solved using pessimistic locking at the database level to ensure data consistency under concurrent requests.
*   **CQRS Architecture**: Separates read and write operations for improved performance and scalability.
*   **Domain-Driven Design**: Models the business domain accurately with entities, repositories, and domain events.
*   **Auditing**: Automatically records a history of all major booking events (Created, Confirmed, Cancelled).
*   **API Documentation**: Automatically generated and interactive API documentation with Swagger (OpenAPI).

## 🛠️ Tech Stack

*   **Framework**: [NestJS](https://nestjs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
*   **Architecture**: DDD, CQRS (`@nestjs/cqrs`)
*   **ORM**: [TypeORM](https://typeorm.io/)
*   **Database**: PostgreSQL
*   **API Specification**: Swagger (`@nestjs/swagger`)
*   **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)

## 🚀 Getting Started with Docker (Recommended)

This project is fully containerized, which is the easiest and most reliable way to run the application and its database.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose must be installed and running.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Build and start the services:**
    This single command will build the NestJS application image and start both the application and database containers.
    ```bash
    docker compose up --build
    ```

3.  **Run Database Migrations:**
    The first time you start the application, or whenever there are new database changes, you need to run the migrations. Open a **new terminal window** and run:
    ```bash
    docker compose exec app npm run migration:run
    ```

The application is now running and available at `http://localhost:3000`.

## 🧪 Running Tests

The project includes unit, integration, and end-to-end (E2E) tests.

### Unit Tests

These tests run in isolation and do not require a database connection.
```bash
npm run test
```

### Integration & E2E Tests (with Docker)

These tests run against a dedicated, containerized test database. The command handles starting the test database, running all tests, and shutting it down.
```bash
npm run test:integration
```

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger UI for API documentation and testing at:

[`http://localhost:3000/docs`](http://localhost:3000/docs)

## 🏗️ Architectural Decisions & Future Improvements

### Race Condition Handling

A potential race condition exists when two concurrent requests attempt to book the same resource simultaneously.

*   **Implemented Solution**: This project solves the race condition using **pessimistic locking at the database level**. Within the `CreateBookingHandler`, a transaction is initiated, and a `SELECT ... FOR UPDATE` query is placed on the `resources` table row for the specific resource being booked. This forces any concurrent transaction trying to book the same resource to wait until the first one is complete, guaranteeing data consistency.

*   **Alternative & Rationale**: For a system designed to scale across multiple instances (a distributed system), a more scalable approach would be to use a distributed lock with an external service like Redis. However, the database-level lock was chosen because it is a robust, self-contained solution that correctly solves the core problem without adding and managing a new dependency.

### Migration Automation

*   **Current State**: Migrations are run manually via `docker compose exec app npm run migration:run`. This was a deliberate choice to ensure a stable, predictable startup process.

*   **Future Improvement**: The next step would be to fully automate this by modifying the `Dockerfile`'s entrypoint to run the migration command before starting the application server (e.g., `CMD ["sh", "-c", "npm run migration:run && node dist/main"]`).

## 📖 API Model

The API provides RESTful endpoints for managing bookings.

### Main Endpoints

*   **`POST /bookings`**: Creates a new booking.
*   **`GET /bookings/:id`**: Retrieves a specific booking.
*   **`PATCH /bookings/:id/confirm`**: Confirms a pending booking.
*   **`DELETE /bookings/:id`**: Cancels a booking.
*   **`GET /resources/available`**: Finds available resources for a given time slot.
