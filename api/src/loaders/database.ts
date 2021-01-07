import { createConnection, getConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from '../config';

export function connectDatabase(entities: Function[]) {
  const connection = createConnection({
    type: 'postgres',
    url: config.PG_CONN_STRING,
    entities,
    synchronize: config.NODE_ENV === 'development',
    namingStrategy: new SnakeNamingStrategy(),
  });

  if (config.CLEAR_DB_ON_START) {
    clearDatabase();
    console.log('Database cleared.');
  }

  return connection;
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

export async function clearDatabase() {
  const env = process.env.NODE_ENV?.toLowerCase();
  if (env !== 'development' && env !== 'test') {
    return;
  }

  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repo = getConnection().getRepository(entity.name);
    await repo.clear();
  }
}
