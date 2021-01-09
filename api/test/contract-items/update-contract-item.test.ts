import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
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

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

const createItem = async (projectId: string, item: Partial<ContractItem> = testItem) => {
  const res = await client.post({ ...item, projectId }, '/contract-items', defaultHeaders);
  return res.body as ContractItem;
};

it('can update all expected fields of a contract-item', async () => {
  const project = await createProject();
  const item = await createItem(project.id);

  let res = await client.put(
    { itemNumber: 'new-item-number' },
    `/contract-items/${item.id}`,
    defaultHeaders
  );
  expect(res.body.itemNumber).toBe('new-item-number');
  expect(res.status).toBe(200);

  res = await client.put(
    { description: 'new-description' },
    `/contract-items/${item.id}`,
    defaultHeaders
  );
  expect(res.body.description).toBe('new-description');
  expect(res.status).toBe(200);

  res = await client.put({ quantity: 53 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.body.quantity).toBe(53);
  expect(res.status).toBe(200);

  res = await client.put({ unit: 'FT' }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.body.unit).toBe('FT');
  expect(res.status).toBe(200);

  res = await client.put({ unitPrice: 8888 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.body.unitPrice).toBe(8888);
  expect(res.status).toBe(200);

  expect(res.body).toStrictEqual({
    ...apiObjectProps('contract-item'),
    itemNumber: 'new-item-number',
    description: 'new-description',
    quantity: 53,
    unit: 'FT',
    unitPrice: 8888,
  });
});

it('cannot update itemNumber to an already existing one', async () => {
  const project = await createProject();
  const item = await createItem(project.id);
  await createItem(project.id, { ...testItem, itemNumber: 'other-item-number' });

  const res = await client.put(
    { itemNumber: 'other-item-number' },
    `/contract-items/${item.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('cannot updated unintended properties', async () => {
  const project = await createProject();
  const item = await createItem(project.id);

  let res = await client.put({ projectId: 'new-id' }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ project: 'nonsense' }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.get(`/contract-items/${item.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('contract-item'),
    ...item,
  });
  expect(res.status).toBe(200);
});

it('cannot update properties to invalid values', async () => {
  const project = await createProject();
  const item = await createItem(project.id);

  let res = await client.put({ itemNumber: 3333 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ description: 2222 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ quantity: '67d3' }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ unit: 568 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ unitPrice: 88.88 }, `/contract-items/${item.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.get(`/contract-items/${item.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('contract-item'),
    ...item,
  });
});

it('cannot update contract-items from other organizations', async () => {
  // Create other user's organization
  let res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.otherUser('other-user')
  );
  const otherOrgId = res.body.id;
  const otherHeader = headers.userWithOrg(otherOrgId, 'other-user');

  res = await client.post(testProject, '/projects', otherHeader);
  expect(res.status).toBe(201);

  res = await client.post({ ...testItem, projectId: res.body.id }, '/contract-items', otherHeader);
  expect(res.status).toBe(201);
  const itemId = res.body.id;

  res = await client.put({ unitPrice: 3456 }, `/contract-items/${itemId}`, defaultHeaders);
  expect(res.status).toBe(404);
});
