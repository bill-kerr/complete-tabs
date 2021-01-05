import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';

export async function requireMembership(req: Request, _res: Response, next: NextFunction) {
  if (req.user.organizationId !== req.params.id) {
    throw new NotFoundError();
  }
  next();
}
