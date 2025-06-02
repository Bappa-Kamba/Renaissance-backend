import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    code?: string,
    details?: any,
  ) {
    super(
      {
        message,
        code: code || ApiException.getDefaultCodeForStatus(status),
        details,
      },
      status,
    );
  }

  private static getDefaultCodeForStatus(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'VALIDATION_ERROR';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return `HTTP_ERROR_${status}`;
    }
  }
}

// Common exception types
export class ResourceNotFoundException extends ApiException {
  constructor(resourceType: string, id: string) {
    super(
      `${resourceType} with ID ${id} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
    );
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'VALIDATION_ERROR',
      details,
    );
  }
}

export class DuplicateResourceException extends ApiException {
  constructor(resourceType: string, field: string, value: string) {
    super(
      `${resourceType} with ${field} '${value}' already exists`,
      HttpStatus.CONFLICT,
      'DUPLICATE_RESOURCE',
    );
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends ApiException {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}
