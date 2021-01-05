import { NextFunction, Request, Response } from 'express';
import { UnsupportedMediaTypeError } from '../errors';

export function verifyJson(req: Request, _res: Response, next: NextFunction) {
  if (
    req.headers['content-type'] !== 'application/json' &&
    (req.method === 'POST' || req.method === 'PUT')
  ) {
    throw new UnsupportedMediaTypeError();
  }

  next();
}
