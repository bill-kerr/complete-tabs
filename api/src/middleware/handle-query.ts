import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import querystring from 'query-string';
import { Query } from '../domain/query.entity';
import { ValidationError } from '../errors';
import { setObjectPrototype } from '../utils';

export async function handleQuery(req: Request, _res: Response, next: NextFunction) {
  const parsed = querystring.parseUrl(req.originalUrl, { parseNumbers: true });
  const data = setObjectPrototype(parsed.query, Query);
  const errors = await validate(data, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  req.queryParams = plainToClass(Query, data);
  next();
}
