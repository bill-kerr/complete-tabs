import { Application } from 'express';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import request from 'supertest';
import { initExpressApp } from '../src/loaders/express';
import { Organization } from '../src/domain/organization/organization.entity';
import { Project } from '../src/domain/project/project.entity';
import { ContractItem } from '../src/domain/contract-item/contract-item.entity';

export async function initialize() {
  await connectTestDb();
  return initExpressApp();
}

export async function connectTestDb() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.PG_CONN_STRING,
      entities: [Organization, Project, ContractItem],
      synchronize: true,
      dropSchema: true,
      namingStrategy: new SnakeNamingStrategy(),
    });

    if (!connection.isConnected) {
      throw new Error('Failed to connect to database');
    }

    return connection;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export function makeClient(baseUrl: string, defaultHeaders: {}, app: Application) {
  const makeUrl = (url?: string) => (url ? baseUrl + url : baseUrl);
  return {
    get: (url?: string, headers = defaultHeaders) => {
      return request(app).get(makeUrl(url)).set(headers).send();
    },
    post: (body: any, url?: string, headers = defaultHeaders) => {
      return request(app).post(makeUrl(url)).set(headers).send(body);
    },
    put: (body: any, url?: string, headers = defaultHeaders) => {
      return request(app).put(makeUrl(url)).set(headers).send(body);
    },
    delete: (url?: string, headers = defaultHeaders) => {
      return request(app).delete(makeUrl(url)).set(headers).send();
    },
  };
}

export type TestClient = ReturnType<typeof makeClient>;

const defaultHeaders = {
  Authorization: 'Bearer test-id',
  'Content-Type': 'application/json',
};
export const headers = {
  default: defaultHeaders,
  otherUser: (userId: string = 'other-user') => ({
    ...defaultHeaders,
    Authorization: `Bearer ${userId}`,
  }),
  failTokenInvalid: {
    ...defaultHeaders,
    Authorization: 'Bearer fail:invalid',
  },
  failTokenExpired: {
    ...defaultHeaders,
    Authorization: 'Bearer fail:expired',
  },
  userWithOrg: (orgId: string, userId: string = 'test-id') => ({
    ...defaultHeaders,
    Authorization: `Bearer org:${orgId} user:${userId}`,
  }),
};

export const apiObjectProps = (object: string) => ({
  id: expect.any(String),
  object,
  createdAt: expect.any(Number),
  updatedAt: expect.any(Number),
});

export const validationError = (message: string) => ({
  object: 'error-detail',
  name: 'Validation Error',
  details: message,
});
