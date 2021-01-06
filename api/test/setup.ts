import { getConnection } from 'typeorm';
import { Organization } from '../src/domain/organization/organization.entity';

afterEach(async () => {
  await Organization.clear();
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
