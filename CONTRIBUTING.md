# Contributing to Renaissance Backend

Thank you for your interest in contributing to the Renaissance Backend project! This document provides guidelines and instructions for contributing to our codebase.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [API Design Guidelines](#api-design-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/Renaissance-backend.git`
3. Set up your development environment following the instructions in the [README.md](README.md)
4. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes in your feature branch
2. Write or update tests as necessary
3. Ensure all tests pass: `npm run test`
4. Ensure code style is correct: `npm run lint`
5. Commit your changes with a descriptive commit message
6. Push your branch to your fork: `git push origin feature/your-feature-name`
7. Create a pull request to the main repository

## API Design Guidelines

We follow RESTful API design principles to ensure consistency across all endpoints. Please refer to our [API Guidelines](docs/API_GUIDELINES.md) for detailed information.

Here's a quick summary of our API design principles:

### Resource Naming

- Use plural nouns for resource collections (e.g., `/teams`, `/players`)
- Follow a consistent URL structure:
  - Collection: `/resources`
  - Specific resource: `/resources/{id}`
  - Sub-resource collection: `/resources/{id}/sub-resources`

### HTTP Methods

- `GET`: Retrieve resources
- `POST`: Create a new resource
- `PUT`: Update a resource (full update)
- `PATCH`: Partial update of a resource
- `DELETE`: Remove a resource

### Response Format

All API responses should follow this structure:

```json
{
  "data": { ... },  // Resource or collection
  "meta": {         // Metadata (pagination, etc.)
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

Error responses should follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }  // Optional additional details
  }
}
```

### Implementation in NestJS

When implementing new endpoints in NestJS:

1. Create a module for your resource
2. Define entities in the `entities` directory
3. Create DTOs in the `dto` directory
4. Implement the service with CRUD operations
5. Implement the controller with RESTful endpoints
6. Document all endpoints with Swagger annotations

See existing modules like `teams` and `players` for examples of proper implementation.

## Testing Guidelines

- Write unit tests for all services and controllers
- Write e2e tests for API endpoints
- Test both happy paths and error cases
- Maintain test coverage above 80%

## Pull Request Process

1. Ensure your code follows our style guidelines
2. Update documentation as necessary
3. Include tests for new functionality
4. Your PR should be reviewed by at least one maintainer
5. Once approved, a maintainer will merge your PR

Thank you for contributing to Renaissance Backend!
