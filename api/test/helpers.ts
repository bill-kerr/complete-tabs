import { Application } from 'express';
import { createConnection } from 'typeorm';
import request from 'supertest';
import { initExpressApp } from '../src/loaders/express';
import { Organization } from '../src/domain/organization/organization.entity';
import { Project } from '../src/domain/project/project.entity';

export async function initialize() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.PG_CONN_STRING,
      entities: [Organization, Project],
      synchronize: true,
      dropSchema: true,
    });

    if (!connection.isConnected) {
      throw new Error('Failed to connect to database');
    }
  } catch (error) {
    console.error(error);
  }

  return initExpressApp();
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
  secondUser: {
    ...defaultHeaders,
    Authorization: 'Bearer second-user',
  },
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
