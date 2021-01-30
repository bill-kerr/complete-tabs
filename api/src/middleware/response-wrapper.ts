import { classToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { Groups } from '../domain/groups';

export function responseWrapper(_req: Request, res: Response, next: NextFunction) {
  res.sendRes = <T>(body: T | T[], groups: string[] = [Groups.READ]) => {
    res.json(transform(body, groups));
  };
  next();
}

function transform<T>(body: T | T[], groups: string[]) {
  return Array.isArray(body) ? listTransform(body, groups) : classToPlain(body, { groups });
}

function listTransform<T>(list: T[], groups: string[]) {
  return {
    object: 'list',
    data: list.map(item => classToPlain(item, { groups })),
  };
}
