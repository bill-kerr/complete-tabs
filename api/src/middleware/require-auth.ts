import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/errors';
import { verifyToken } from '../firebase';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    throw new UnauthorizedError('The Authorization header must be set.');
  }

  const authHeader = req.headers.authorization.split('Bearer ');
  if (authHeader.length < 2) {
    throw new UnauthorizedError(
      "The Authorization header must be formatted as 'Bearer <token>' where <token> is a valid access token."
    );
  }

  const authToken = authHeader[1];
  try {
    await verifyToken(authToken);
  } catch (error) {
    throw new UnauthorizedError('Invalid access token.');
  }
  next();
}
