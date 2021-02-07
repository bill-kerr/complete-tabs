import { Request, Response, NextFunction } from 'express';

interface AddPropertyOptions {
  key: string;
  location: 'params' | 'query' | 'userId';
  destinationKey?: string;
}

export function addProperty({ key, location, destinationKey }: AddPropertyOptions) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!destinationKey) {
      destinationKey = key;
    }

    if (location === 'userId') {
      req.body = { ...req.body, [destinationKey]: req.user.id };
      next();
    }

    if (location === 'params') {
      req.body = { ...req.body, [destinationKey]: req.params[key] };
      next();
    }
  };
}
