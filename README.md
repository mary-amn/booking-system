# Booking System API

This project is a robust RESTful API for a booking and reservation system, built with NestJs. It follows modern software architecture principles, including Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS), to ensure a scalable, maintainable, and testable codebase.

## ✨ Features

*   **Booking Management**: Create, confirm, cancel, and retrieve bookings.
*   **Resource Availability**: Check for available resources within a given time slot.
*   **CQRS Architecture**: Separates read and write operations for improved performance and scalability.
*   **Domain-Driven Design**: Models the business domain accurately with entities, value objects, and repositories.
*   **Type-Safe Database**: Uses TypeORM for reliable and type-safe database interactions.
*   **API Documentation**: Automatically generated and interactive API documentation with Swagger (OpenAPI).
*   **Validation**: Built-in request data validation using `class-validator`.

## 🛠️ Tech Stack

*   **Framework**: [NestJS](https://nestjs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Architecture**: DDD, CQRS (`@nestjs/cqrs`)
*   **ORM**: [TypeORM](https://typeorm.io/)
*   **API Specification**: Swagger (`@nestjs/swagger`)
*   **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A running instance of a database (e.g., PostgreSQL, MySQL).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database credentials and other environment-specific configurations.

    ```env
    # .env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=user
    DB_PASSWORD=password
    DB_DATABASE=booking_db
    ```

### Running the Application

*   **Development mode:**
    ```bash
    npm run start:dev
    ```
    The application will start with hot-reloading enabled.

*   **Production mode:**
    ```bash
    npm run build
    npm run start:prod
    ```

The server will be running on `http://localhost:3000` by default.

### Running Tests

*   **Run all unit and intigration tests:**
    ```bash
    npm test
    ```


*   **Run tests with coverage:**
    ```bash
    npm run test:cov
    ```

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger UI for API documentation and testing at:

`http://localhost:3000/docs`

## 🏗️ Project Structure

The project follows a modular structure inspired by Domain-Driven Design. Each business domain (e.g., `booking`, `user`) is a separate module.

```
src
├── modules/
│   ├── booking/
│   │   ├── application/    # Use cases (Commands, Queries, Handlers)
│   │   ├── domain/         # Core business logic (Entities, Repositories, Value Objects)
│   │   ├── infrastructure/ # Implementations (DB, external services)
│   │   └── interface/      # API layer (Controllers, DTOs)
│   └── ...               # Other modules (e.g., user, resource)
├── shared/                 # Shared utilities and modules
└── main.ts                 # Application entry point
```


## 📖 API Model

The API provides RESTful endpoints for managing bookings.

### Main Endpoints

*   **`POST /bookings`**
    *   Creates a new booking.
    *   **Request Body:**
        ```json
        {
          "userId": "string",
          "resourceId": "string",
          "startsAt": "ISO8601DateString",
          "endsAt": "ISO8601DateString"
        }
        ```
    *   **Success Response (201 Created):**
        ```json
        {
          "id": "string"
        }
        ```

*   **`GET /bookings/:id`**
    *   Retrieves a specific booking by its ID.
    *   **Success Response (200 OK):**
        ```json
        {
          "id": "string",
          "userId": "string",
          "resourceId": "string",
          "startsAt": "ISO8601DateString",
          "endsAt": "ISO8601DateString",
          "status": "CONFIRMED" | "PENDING" | "CANCELLED"
        }
        ```

*   **`PATCH /bookings/:id/confirm`**
    *   Confirms a pending booking.
    *   **Success Response (200 OK):**
        ```json
        {
          "id": "string",
          "status": "CONFIRMED"
        }
        ```

*   **`DELETE /bookings/:id`**
    *   Cancels a booking.
    *   **Success Response (200 OK):**
        ```json
        {
          "id": "string",
          "status": "CANCELLED"
        }
        ```

*   **`GET /resources/available`**
    *   Finds available resources for a given time slot.
    *   **Query Parameters:** `startTime`, `endTime`
    *   **Success Response (200 OK):**
        ```json
        [
          {
            "id": "string",
            "name": "string"
          }
        ]
        ```

## 📊 Data Model

The core of the data model is the `Booking` entity, which is managed by TypeORM.

### `Booking` Entity

This entity represents a reservation in the system.

| Column       | Type      | Description                                  |
| :----------- | :-------- | :------------------------------------------- |
| `id`         | `number`  | Primary Key (bigint)                           |
| `userId`     | `number`  | Foreign key to the `User` entity.            |
| `resourceId` | `number`  | Foreign key to the `Resource` entity.        |
| `startsAt`   | `Date`    | The start date and time of the booking.      |
| `endsAt`     | `Date`    | The end date and time of the booking.        |
| `status`     | `enum`    | The current status (`PENDING`, `CONFIRMED`). |
| `createdAt`  | `Date`    | Timestamp of when the record was created.    |
| `updatedAt`  | `Date`    | Timestamp of the last update.                |

### Relationships

*   A **Booking** belongs to one **User**.
*   A **Booking** belongs to one **Resource**.
*   A **User** can have many **Bookings**.
*   A **Resource** can have many **Bookings**.
