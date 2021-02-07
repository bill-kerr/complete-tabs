import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Project } from '../../src/domain/project/project.entity';
import { TabItem } from '../../src/domain/tab-item/tab-item.entity';
import {
  apiObjectProps,
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

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
});

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', headers.default);
  return res.body as Project;
};

const createContractItem = async (
  projectId: string,
  item: Partial<ContractItem> = testContractItem
) => {
  const res = await client.post({ ...item, projectId }, '/contract-items', headers.default);
  return res.body as ContractItem;
};

const createTabItem = async (contractItemId: string, item: Partial<TabItem> = testTabItem) => {
  const res = await client.post({ ...item, contractItemId }, '/tab-items', headers.default);
  return res.body as TabItem;
};

const createProjectAndContractItem = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  return { project, contractItem };
};

it('can update all intended properties on tab-items', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const tabItem = await createTabItem(contractItem.id);

  let res = await client.put(
    { tabSet: 'new-tab-set' },
    `/tab-items/${tabItem.id}`,
    headers.default
  );
  expect(res.body.tabSet).toBe('new-tab-set');

  res = await client.put({ quantity: 99.99 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.quantity).toBe(99.99);

  res = await client.put({ remarks: 'new-remarks' }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.remarks).toBe('new-remarks');

  res = await client.put({ street: 'new-street' }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.street).toBe('new-street');

  res = await client.put({ side: 'new-side' }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.side).toBe('new-side');

  res = await client.put({ beginStation: 5432 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.beginStation).toBe(5432);

  res = await client.put({ endStation: 12345 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.body.endStation).toBe(12345);

  expect(res.body).toStrictEqual({
    ...apiObjectProps('tab-item'),
    tabSet: 'new-tab-set',
    quantity: 99.99,
    remarks: 'new-remarks',
    street: 'new-street',
    side: 'new-side',
    beginStation: 5432,
    endStation: 12345,
    contractItemId: expect.any(String),
  });
  expect(res.status).toBe(200);
});

it('cannot update properties to invalid values', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const tabItem = await createTabItem(contractItem.id);

  let res = await client.put({ tabSet: 333 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ quantity: '5' }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ remarks: 5 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ street: 56 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ side: 56 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ beginStation: 56.23 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ endStation: 0.25 }, `/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.get(`/tab-items/${tabItem.id}`, headers.default);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('tab-item'),
    ...tabItem,
  });
});

it('cannot update tab-items from other users', async () => {
  const otherTabItem = await createOtherTabItem(client);

  let res = await client.put(
    { tabSet: 'new-tab-set' },
    `/tab-items/${otherTabItem.id}`,
    headers.default
  );
  expect(res.status).toBe(404);
});
