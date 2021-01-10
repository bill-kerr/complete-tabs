import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Project } from '../../src/domain/project/project.entity';
import { TabItem } from '../../src/domain/tab-item/tab-item.entity';
import {
  createOtherTabItem,
  headers,
  initialize,
  makeClient,
  TestClient,
  testContractItem,
  testProject,
  testTabItem,
} from '../helpers';

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

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

const createContractItem = async (
  projectId: string,
  item: Partial<ContractItem> = testContractItem
) => {
  const res = await client.post({ ...item, projectId }, '/contract-items', defaultHeaders);
  return res.body as ContractItem;
};

const createTabItem = async (contractItemId: string, item: Partial<TabItem> = testTabItem) => {
  const res = await client.post({ ...item, contractItemId }, '/tab-items', defaultHeaders);
  return res.body as TabItem;
};

const createProjectAndContractItem = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  return { project, contractItem };
};

it('can list tab-items via the tab-items endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createTabItem(contractItem.id);
  await createTabItem(contractItem.id);

  const res = await client.get('/tab-items', defaultHeaders);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('can list tab-items via the contract-items endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createTabItem(contractItem.id);

  const res = await client.get(`/contract-items/${contractItem.id}/tab-items`, defaultHeaders);
  expect(res.body.data).toHaveLength(1);
  expect(res.status).toBe(200);
});

it('only retrieves tab-items for the given contract-item', async () => {
  const { contractItem, project } = await createProjectAndContractItem();
  await createTabItem(contractItem.id);

  let res = await client.post(
    { ...testContractItem, itemNumber: 'other-number', projectId: project.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);
  const otherContractItem = res.body;

  res = await client.post(
    { ...testTabItem, contractItemId: otherContractItem.id },
    `/tab-items`,
    defaultHeaders
  );
  expect(res.status).toBe(201);

  res = await client.get(`/contract-items/${otherContractItem.id}/tab-items`, defaultHeaders);
  expect(res.body.data).toHaveLength(1);

  res = await client.get(`/tab-items`, defaultHeaders);
  expect(res.body.data).toHaveLength(2);
});

it('returns an empty list if no tab-items exist', async () => {
  const res = await client.get('/tab-items', defaultHeaders);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});

it('does not list tab-items from other organizations', async () => {
  await createOtherTabItem(client);
  const res = await client.get('/tab-items', defaultHeaders);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});
