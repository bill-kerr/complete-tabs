import { ApiObject } from './api-object';

export interface Metadata {
  object: 'metadata';
  count: number;
  self: string;
  next?: string;
}

export class ListResponse<T extends ApiObject> {
  object: 'list';
  metadata: Metadata;
  data: T[];
}
