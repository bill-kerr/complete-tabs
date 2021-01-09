import { Application } from 'express';
import { Project } from '../../src/domain/project/project.entity';
import { apiObjectProps, headers, initialize, makeClient, TestClient } from '../helpers';

let app: Application;
let client: TestClient;
let orgId: string;
let defaultHeaders: ReturnType<typeof headers.userWithOrg>;

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
});

beforeEach(async () => {
  const res = await client.post({ name: 'test-org' }, '/organizations');
  orgId = res.body.id;
  defaultHeaders = headers.userWithOrg(orgId);
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

const createProject = async () => {
  const res = await client.post(testProject, '/projects', defaultHeaders);
  return res.body as Project;
};

it('can create a contract-item from the projects endpoint', async () => {
  const project = await createProject();
  const res = await client.post(testItem, `/projects/${project.id}/contract-items`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...testItem,
    ...apiObjectProps('contract-item'),
  });
  expect(res.status).toBe(201);
});

it('can create a contract-item from the contract-items endpoint', async () => {
  const project = await createProject();
  const res = await client.post(
    { ...testItem, projectId: project.id },
    `/contract-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...testItem,
    ...apiObjectProps('contract-item'),
  });
  expect(res.status).toBe(201);
});
