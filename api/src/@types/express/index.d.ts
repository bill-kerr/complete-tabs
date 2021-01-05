import { User } from '../../domain/auth/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }

    interface Response {
      sendRes: <T>(body: T) => void;
    }
  }
}
