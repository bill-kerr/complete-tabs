import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';

export const validation = {
  length: (property: string, min: number, max: number) =>
    `Property ${property} must be between ${min} and ${max} characters long.`,

  string: (property: string) => `Property ${property} must contain a string.`,

  boolean: (property: string) => `Property ${property} must contain a boolean value.`,

  number: (property: string) => `Property ${property} must contain a number.`,

  integer: (property: string) => `Property ${property} must contain an integer.`,

  email: (property: string = 'email') => `Property ${property} must contain a valid email.`,

  required: (property: string) => `Property ${property} is required and should not be empty.`,

  extra: (property: string) => `Property ${property} should not exist.`,
};

export function validateBody<T>(targetClass: ClassType<T>, groups: string[] = []) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const data = setObjectPrototype(req.body, targetClass);
    const errors = await validate(data, {
      groups,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    req.body = plainToClass(targetClass, req.body, { groups });
    next();
  };
}

export function mapClassValidationErrors(errors: ClassValidationError[]): string[] {
  const messages: string[] = [];
  errors.forEach(error => {
    if (error.constraints) {
      const fieldErrors = Object.values(error.constraints).map(message =>
        parseValidationMessage(message)
      );
      messages.push(...fieldErrors);
    }
  });
  return messages;
}

function parseValidationMessage(message: string) {
  if (message.endsWith('should not exist')) {
    message = message[0].toUpperCase() + message.slice(1) + '.';
  }
  return message;
}

function setObjectPrototype<T>(body: any, targetClass: ClassType<T>) {
  return Object.setPrototypeOf(body, targetClass.prototype);
}
