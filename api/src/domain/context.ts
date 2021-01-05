import { ApiObject } from './api-object';
import { User } from './auth/user.entity';

export interface ReadContext<T extends ApiObject> {
  user: User;
  filter?: Partial<T>;
}

export interface WriteContext<T extends ApiObject> extends ReadContext<T> {
  resource: Partial<T>;
}
