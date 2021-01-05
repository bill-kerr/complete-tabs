import { NextFunction, Request, Response } from 'express';
import { MethodNotAllowedError } from '../errors';

export function methodChecker(req: Request, _res: Response, next: NextFunction) {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!allowedMethods.includes(req.method)) {
    throw new MethodNotAllowedError();
  }
  next();
}
