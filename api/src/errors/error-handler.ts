import { NextFunction, Request, Response } from 'express';
import { DatabaseError, getDatabaseError } from '../loaders/database';
import { InternalServerError, NotFoundError } from './errors';
import { BaseError, ErrorResponse } from './types';

const defaultError: ErrorResponse = {
  object: 'error',
  name: 'Internal server error',
  statusCode: 500,
  details: 'An unknown error occurred',
};

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof InternalServerError) {
    return sendUnknownError(res, err);
  }

  if (err instanceof BaseError) {
    return sendErrorResponse(res, err);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      name: 'Bad Request',
      statusCode: 400,
      details: 'The request contained invalid JSON.',
    };
    return res.status(400).json(errorResponse);
  }

  const dbError = getDatabaseError(err);
  if (dbError !== DatabaseError.UNKNOWN) {
    return handleDatabaseError(res, dbError);
  }

  return sendUnknownError(res, err);
}

function sendErrorResponse(res: Response, error: BaseError) {
  const errorResponse: ErrorResponse = {
    object: 'error',
    name: error.name,
    statusCode: error.statusCode,
    details: error.details,
  };
  return res.status(error.statusCode).json(errorResponse);
}

function sendUnknownError(res: Response, error: Error) {
  console.error(error);
  return res.status(defaultError.statusCode).json(defaultError);
}

function handleDatabaseError(res: Response, error: DatabaseError) {
  switch (error) {
    case DatabaseError.NOT_FOUND:
      return sendErrorResponse(res, new NotFoundError());
    default:
      return sendUnknownError(res, new InternalServerError());
  }
}
