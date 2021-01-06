import dotenv from 'dotenv';
dotenv.config({ path: './test/test.env' });
import { getConnection } from 'typeorm';

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  getConnection().close();
});

jest.mock('../src/loaders/database', () => {
  enum DatabaseError {
    UNKNOWN = 'unknown',
    DUPLICATE = 'duplicate',
  }

  return {
    DatabaseError,
    getDatabaseError: (error: any) => {
      switch (error.errno) {
        case 19:
          return DatabaseError.DUPLICATE;
        default:
          console.error(error);
          return DatabaseError.UNKNOWN;
      }
    },
  };
});

async function clearDatabase() {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repo = getConnection().getRepository(entity.name);
    await repo.clear();
  }
}
