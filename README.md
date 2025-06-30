# Fitness Tracker API

A RESTful API backend for a fitness and meal tracking application built with Express.js, PostgreSQL, JWT authentication, and Swagger documentation.

## Features
- User registration, login, and profile management
- Meal and food tracking
- Workout and exercise logging
- Basic analytics (nutrition and workout summaries)
- JWT authentication
- Swagger API documentation

## Tech Stack
- Express.js
- PostgreSQL (raw SQL)
- JWT, bcrypt, helmet, Joi
- Swagger/OpenAPI

## Setup
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your values
4. Set up PostgreSQL and run migrations:
   ```bash
   npm run migrate
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. Access Swagger docs at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Project Structure
```
src/
├── controllers/
├── middleware/
├── routes/
├── services/
├── database/
│   ├── connection.js
│   ├── migrations/
│   └── queries/
├── utils/
├── validators/
├── docs/
│   └── swagger.js
└── app.js
```

## API Endpoints
See Swagger docs for full details. 