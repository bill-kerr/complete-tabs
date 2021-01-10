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

const testContractItem = {
  itemNumber: '9999-9999',
  description: 'test-description',
  quantity: 33.35,
  unit: 'EA',
  unitPrice: 6667,
};

const testTabItem = {
  tabSet: 'test-tab-set',
  quantity: 45.56,
  remarks: 'Test remarks',
  street: 'test street',
  side: 'test side',
  beginStation: 4565,
  endStation: 5469,
};

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

const createProjectAndContractItem = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  return { project, contractItem };
};

it('can create a tab-item via the contract-items endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const res = await client.post(
    testTabItem,
    `/contract-items/${contractItem.id}/tab-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('tab-item'),
    ...testTabItem,
  });
  expect(res.status).toBe(201);
});
