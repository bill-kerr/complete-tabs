import { User } from '../../domain/auth/user.entity';
import { Query } from '../../domain/query.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
      queryParams?: Query;
    }

    interface Response {
      sendRes: <T>(body: T) => void;
    }
  }
}
