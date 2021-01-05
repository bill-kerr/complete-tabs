import { ValidationError as ClassValidationError } from 'class-validator';
import { mapClassValidationErrors } from '../validation';
import { BaseError, ErrorDetail } from './types';

export class InternalServerError extends BaseError {
  statusCode = 500;
  name = 'Internal Server Error';

  constructor(public details = 'An unknown error occurred.') {
    super(details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class ValidationError extends BaseError {
  statusCode = 400;
  name = 'Bad Request Error';
  details: ErrorDetail[];

  constructor(private errors: ClassValidationError[]) {
    super('Validation errors occurred.');
    Object.setPrototypeOf(this, ValidationError.prototype);

    const messages = mapClassValidationErrors(this.errors);
    this.setErrors(messages);
  }

  private setErrors(messages: string[]) {
    this.details = messages.map(message => ({
      object: 'error-detail',
      name: 'Validation Error',
      details: message,
    }));
  }
}

export class BadRequestError extends BaseError {
  statusCode = 400;
  name = 'Bad Request Error';

  constructor(public details: string) {
    super(details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends BaseError {
  statusCode = 401;
  name = 'Unauthorized Error';

  constructor(public details: string) {
    super(details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class NotFoundError extends BaseError {
  statusCode = 404;
  name = 'Not Found Error';

  constructor(public details: string = 'The requested resource was not found.') {
    super(details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class MethodNotAllowedError extends BaseError {
  statusCode = 405;
  name = 'Method Not Allowed Error';

  constructor(
    public details: string = 'Request was made with a bad HTTP method. Only GET, POST, PUT, and DELETE methods are allowed.'
  ) {
    super(details);
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }
}

export class UnsupportedMediaTypeError extends BaseError {
  statusCode = 415;
  name = 'Unsupported Media Type Error';

  constructor(
    public details: string = 'Requests must contain a Content-Type header of application/json.'
  ) {
    super(details);
    Object.setPrototypeOf(this, UnsupportedMediaTypeError.prototype);
  }
}
