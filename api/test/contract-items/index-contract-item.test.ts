import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Project } from '../../src/domain/project/project.entity';
import { headers, initialize, makeClient, TestClient } from '../helpers';

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

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

const createItem = async (projectId: string, item: Partial<ContractItem> = testItem) => {
  const res = await client.post({ ...item, projectId }, '/contract-items', defaultHeaders);
  return res.body as ContractItem;
};

it('can get a contract-item', async () => {
  const project = await createProject();
  const item = await createItem(project.id);
  const res = await client.get(`/contract-items/${item.id}`, defaultHeaders);
  expect(res.body).toStrictEqual(item);
  expect(res.status).toBe(200);
});

it('returns a 404 when the contract-item does not exist', async () => {
  const res = await client.get('/contract-items/does-not-exist', defaultHeaders);
  expect(res.body).toStrictEqual({
    object: 'error',
    name: 'Not Found Error',
    statusCode: 404,
    details: 'The requested resource was not found.',
  });
  expect(res.status).toBe(404);
});

it('can only get contract-items that belong to the users organization', async () => {
  // Create other user's organization
  let res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.otherUser('other-user')
  );
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testItem, projectId: res.body.id },
    '/contract-items',
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.get(`/contract-items/${res.body.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});
