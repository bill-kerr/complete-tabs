import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';

export function requireMembership(
  paramName: string = 'id',
  paramLocation: 'body' | 'params' | 'query' = 'params'
) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    const value = req[paramLocation][paramName];
    if (req.user.organizationId !== value) {
      throw new NotFoundError();
    }
    next();
  };
}
