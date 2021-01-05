import { User } from '../../types';

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
