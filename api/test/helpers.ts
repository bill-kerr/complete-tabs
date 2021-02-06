import { Application } from 'express';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import request from 'supertest';
import { initExpressApp } from '../src/loaders/express';
import { Project } from '../src/domain/project/project.entity';
import { ContractItem } from '../src/domain/contract-item/contract-item.entity';
import { Estimate } from '../src/domain/estimate/estimate.entity';
import { TabItem } from '../src/domain/tab-item/tab-item.entity';
import { EstimateItem } from '../src/domain/estimate-item/estimate-item.entity';
import { CostCode } from '../src/domain/cost-code/cost-code.entity';

export async function initialize() {
  await connectTestDb();
  return initExpressApp();
}

export async function connectTestDb() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.PG_CONN_STRING,
      entities: [Project, ContractItem, Estimate, TabItem, EstimateItem, CostCode],
      synchronize: true,
      dropSchema: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
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
  Authorization: 'Bearer user:test-id',
  'Content-Type': 'application/json',
};
export const headers = {
  default: defaultHeaders,
  otherUser: (userId: string = 'user:other-user') => ({
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
};

export const testProject = {
  name: 'test-project',
  projectNumber: 'test-project-number',
  description: 'This is a test project',
  client: 'test-client',
  active: true,
};

export const testContractItem = {
  itemNumber: '9999-9999',
  description: 'test-description',
  quantity: 33.35,
  unit: 'EA',
  unitPrice: 6667,
};

export const testTabItem = {
  tabSet: 'test-tab-set',
  quantity: 45.56,
  remarks: 'Test remarks',
  street: 'test street',
  side: 'test side',
  beginStation: 4565,
  endStation: 5469,
};

export const testEstimate = {
  estimateNumber: '1',
  periodEnding: '2021-05-01',
};

export const testEstimateItem = {
  quantity: 1,
};

export const testCostCode = {
  code: '99999-99999',
  description: 'test-description',
  quantity: 1,
  unit: 'EA',
  laborHours: 12,
  equipmentHours: 13,
  laborBudget: 1200,
  equipmentBudget: 1300,
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

export const createOtherTabItem = async (client: TestClient) => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    testContractItem,
    `/projects/${otherProject.id}/contract-items`,
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testTabItem, contractItemId: res.body.id },
    '/tab-items',
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  return res.body as TabItem;
};

export const createOtherEstimateItem = async (client: TestClient) => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    testContractItem,
    `/projects/${otherProject.id}/contract-items`,
    headers.otherUser()
  );
  expect(res.status).toBe(201);
  const contractItem = res.body;

  res = await client.post(
    testEstimate,
    `/projects/${otherProject.id}/estimates`,
    headers.otherUser()
  );
  expect(res.status).toBe(201);
  const estimate = res.body;

  res = await client.post(
    { ...testEstimateItem, contractItemId: contractItem.id, estimateId: estimate.id },
    '/estimate-items',
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  return res.body as EstimateItem;
};

export const createOtherCostCode = async (client: TestClient) => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    testContractItem,
    `/projects/${otherProject.id}/contract-items`,
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  return res.body as CostCode;
};
