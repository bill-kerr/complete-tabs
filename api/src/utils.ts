import { ClassType } from 'class-transformer/ClassTransformer';
import { v4 as uuidV4 } from 'uuid';
import { config } from './config';
import { ApiObject } from './domain/api-object';
import { ReadManyContext } from './domain/context';

export const uuid = () => uuidV4();

export const unixTime = () => Math.round(new Date().getTime() / 1000);

export const calcPagination = (context: ReadManyContext<ApiObject>) => {
  const take = context.limit && context.limit < config.PAGE_SIZE ? context.limit : config.PAGE_SIZE;
  const skip = ((context.page || 1) - 1) * take;
  return { skip, take };
};

export const setObjectPrototype = <T>(body: any, targetClass: ClassType<T>) => {
  return Object.setPrototypeOf(body, targetClass.prototype);
};
