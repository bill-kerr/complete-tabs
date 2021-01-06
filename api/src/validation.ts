import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';

export const validation = {
  length: (field: string, min: number, max: number) =>
    `The ${field} field must be between ${min} and ${max} characters long.`,

  string: (field: string) => `The ${field} field must contain a string.`,

  boolean: (field: string) => `The ${field} field must contain a boolean value.`,

  email: (field: string = 'email') => `The ${field} field must contain a valid email.`,

  roleType: (field: string = 'type') => `The ${field} field must be one of ['USER', 'ADMIN'].`,

  operation: (field: string = 'operation') => `The ${field} field must contain a valid operation.`,
};

export function validateBody<T>(
  targetClass: ClassType<T>,
  groups: string[] = [],
  addUserId = false
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (addUserId) {
      req.body.userId = req.user.id;
    }
    req.body = plainToClass(targetClass, req.body, { groups });
    const errors = await validate(req.body, { groups, forbidUnknownValues: true });
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    next();
  };
}

export function mapClassValidationErrors(errors: ClassValidationError[]): string[] {
  const messages: string[] = [];
  errors.forEach(error => {
    if (error.constraints) {
      const fieldErrors = Object.values(error.constraints).map(message => message);
      messages.push(...fieldErrors);
    }
  });
  return messages;
}
