import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
  apiObjectProps,
  headers,
  initialize,
  makeClient,
  TestClient,
  testContractItem,
  testEstimate,
  testProject,
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

const testEstimateItem = {
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

const createEstimate = async (projectId: string, estimate = testEstimate) => {
  const res = await client.post({ ...testEstimate, projectId }, '/estimates', defaultHeaders);
  return res.body as Estimate;
};

const createProjectContractItemAndEstimate = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  const estimate = await createEstimate(project.id);
  return { project, contractItem, estimate };
};

it('can create an estimate-item via the contract-items endpoint', async () => {
  const { contractItem } = await createProjectContractItemAndEstimate();
  const res = await client.post(
    testEstimateItem,
    `/contract-items/${contractItem.id}/estimate-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    ...testEstimateItem,
  });
  expect(res.status).toBe(201);
});

it.todo('can create an estimate-item via the estimates endpoint');
it.todo('can create an estimate-item via the estimate-items endpoint');
