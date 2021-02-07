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

it('can delete a tab-item', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const tabItem = await createTabItem(contractItem.id);

  let res = await client.delete(`/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(204);

  res = await client.get(`/tab-items/${tabItem.id}`, headers.default);
  expect(res.status).toBe(404);
});

it('cannot delete a tab-item from another user', async () => {
  const otherTabItem = await createOtherTabItem(client);

  let res = await client.delete(`/tab-items/${otherTabItem.id}`, headers.default);
  expect(res.status).toBe(404);
});
