# Renaissance API Guidelines

## RESTful API Design Principles

This document outlines the guidelines for designing and implementing RESTful API endpoints in the Renaissance backend service.

## 1. Resource Naming Conventions

### 1.1 Use Nouns for Resources

- Use plural nouns for resource collections
- Example: `/teams`, `/players`, `/matches`

### 1.2 Resource Path Structure

- Collection: `/resources`
- Specific resource: `/resources/{id}`
- Sub-resource collection: `/resources/{id}/sub-resources`
- Specific sub-resource: `/resources/{id}/sub-resources/{sub-id}`

Examples:
- `/teams` - Get all teams
- `/teams/123` - Get team with ID 123
- `/teams/123/players` - Get all players for team 123
- `/teams/123/players/456` - Get player 456 from team 123

## 2. HTTP Methods

| Method | Purpose | Example |
|--------|---------|--------|
| GET | Retrieve resources | `GET /players` - Get all players |
| POST | Create a new resource | `POST /players` - Create a new player |
| PUT | Update a resource (full update) | `PUT /players/123` - Update player 123 |
| PATCH | Partial update of a resource | `PATCH /players/123` - Update specific fields of player 123 |
| DELETE | Remove a resource | `DELETE /players/123` - Delete player 123 |

## 3. Query Parameters

### 3.1 Pagination

- `page`: Page number (1-based)
- `limit`: Number of items per page

Example: `/players?page=2&limit=10`

### 3.2 Sorting

- `sort`: Field to sort by
- `order`: Sort direction (`asc` or `desc`)

Example: `/players?sort=name&order=asc`

### 3.3 Filtering

- Use field names as query parameters

Example: `/players?position=striker&team=123`

## 4. Response Format

### 4.1 Success Response Structure

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

### 4.2 Error Response Structure

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }  // Optional additional details
  }
}
```

## 5. HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Successful DELETE or PUT/PATCH that returns no content |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authentication succeeded but user lacks permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Request conflicts with current state (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side error |

## 6. Versioning

- Version the API in the URL path
- Example: `/api/v1/players`

## 7. Authentication

- Use Bearer token authentication with JWT
- Include token in Authorization header: `Authorization: Bearer {token}`

## 8. Documentation

- All endpoints must be documented using Swagger/OpenAPI
- Include descriptions, parameters, request/response examples

## 9. Implementation in NestJS

### 9.1 Controller Structure

```typescript
@Controller('api/v1/resources')
export class ResourceController {
  @Get()
  findAll(@Query() query: PaginationDto): Promise<ResourceDto[]> { ... }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResourceDto> { ... }

  @Post()
  create(@Body() createDto: CreateResourceDto): Promise<ResourceDto> { ... }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateResourceDto,
  ): Promise<ResourceDto> { ... }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> { ... }
}
```

### 9.2 DTO Structure

- Create separate DTOs for different operations (create, update, response)
- Use class-validator decorators for validation
- Use Swagger decorators for documentation

```typescript
export class CreateResourceDto {
  @ApiProperty({ example: 'Resource name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

## 10. Testing

- Write unit tests for controllers and services
- Write e2e tests for API endpoints
- Test happy paths and error cases
