# Tech Task

Develop a user management system that uses a microservice architecture based on NestJS, including a microservice for user registration and authentication and for storing user profiles in a database.

## Stack

1. BackEnd:
   - NestJS

   - PostgreSQL

   - Redis

   - TypeORM

   - JWT

## Functionality

1. User Management Microservice:
   - Develop a microservice for user registration, authentication, profile updates, and user deletion.

   - Implement user data storage in PostgreSQL using TypeORM.

   - Use JWT for user authentication and authorization.

2. Database Migrations:
   - Set up a migration system for PostgreSQL using TypeORM to create and modify the schema of user tables.

   - Implement automatic application of migrations via the CI/CD process.

3. Caching:
   - Implement caching of user profiles in Redis to speed up access to frequently requested data.

   - Cache user data after a successful login; the cache expires after 10 minutes.

   - If a user updates their profile, the cache should be automatically updated.

4. Microservice Interaction:
   - To ensure scalability, implement a microservice architecture by creating a single user management microservice.

5. Optimization and Performance:
   - Evaluate and improve the performance of database queries (indexing fields, optimizing SQL queries).

   - Implement pagination to retrieve a list of all users (via REST API) using NestJS.

6. Testing:
   - Write unit tests for the microservice’s core functions (registration, authentication, profile updates).

   - Implement integration tests to verify the interaction between microservices and Redis.

## Technical Requirements

1. Cache user data after successful authentication.

2. Update the cache after a profile change.

3. Improve database performance by properly configuring indexes and paginating queries.

4. Document the API using Swagger or another tool for automated documentation generation.

## Success Criteria

1. The microservice operates stably and allows for user registration, authentication, and profile updates.

2. Data is cached in Redis and is quickly accessible for repeat queries.

3. All tests pass successfully.

4. Migrations are applied correctly when updating the database.
