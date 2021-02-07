import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Project } from '../../src/domain/project/project.entity';
import { headers, initialize, makeClient, TestClient } from '../helpers';

let app: Application;
let client: TestClient;

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
});

const testProject = {
  name: 'test-project',
  projectNumber: 'test-project-number',
  description: 'This is a test project',
  client: 'test-client',
  active: true,
};

const testItem = {
  itemNumber: '9999-9999',
  description: 'test-description',
  quantity: 33.35,
  unit: 'EA',
  unitPrice: 6667,
};

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', headers.default);
  return res.body as Project;
};

const createItem = async (projectId: string, item: Partial<ContractItem> = testItem) => {
  const res = await client.post({ ...item, projectId }, '/contract-items', headers.default);
  return res.body as ContractItem;
};

it('can delete a contract-item', async () => {
  const project = await createProject();
  const item = await createItem(project.id);

  let res = await client.delete(`/contract-items/${item.id}`, headers.default);
  expect(res.status).toBe(204);
  expect(res.body).toStrictEqual({});

  res = await client.get(`/contract-items/${item.id}`, headers.default);
  expect(res.status).toBe(404);
});

it('cannot delete a contract-item from another user', async () => {
  let res = await client.post(testProject, '/projects', headers.otherUser());
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testItem, projectId: res.body.id },
    '/contract-items',
    headers.otherUser()
  );
  expect(res.status).toBe(201);
  const itemId = res.body.id;

  res = await client.delete(`/contract-items/${itemId}`, headers.default);
  expect(res.status).toBe(404);

  res = await client.get(`/contract-items/${itemId}`, headers.otherUser());
  expect(res.body.id).toBe(itemId);
  expect(res.status).toBe(200);
});
