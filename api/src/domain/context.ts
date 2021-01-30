import { ApiObject } from './api-object';
import { User } from './auth/user.entity';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface ReadContext<T extends ApiObject> {
  user: User;
  filter?: DeepPartial<T>;
}

export interface ReadManyContext<T extends ApiObject> extends ReadContext<T> {
  baseUrl: string;
  page?: number;
  limit?: number;
}

export interface WriteContext<T extends ApiObject> extends ReadContext<T> {
  resource: Partial<T>;
}
