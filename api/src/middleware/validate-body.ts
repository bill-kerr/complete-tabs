import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors';

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

function setObjectPrototype<T>(body: any, targetClass: ClassType<T>) {
  return Object.setPrototypeOf(body, targetClass.prototype);
}
