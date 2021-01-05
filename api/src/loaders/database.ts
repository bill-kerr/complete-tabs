import { createConnection } from 'typeorm';
import { config } from '../config';

export function connectDatabase() {
  return createConnection({
    type: 'postgres',
    url: config.PG_CONN_STRING,
    entities: [],
    synchronize: config.NODE_ENV === 'development',
  });
}

export enum DatabaseError {
  DUPLICATE = 'duplicate',
  UNKNOWN = 'unknown',
}

export function getDatabaseError(error: any): DatabaseError {
  switch (error.code) {
    case '23505':
      return DatabaseError.DUPLICATE;
    default:
      return DatabaseError.UNKNOWN;
  }
}
