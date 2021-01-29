import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { EstimateItem } from '../../src/domain/estimate-item/estimate-item.entity';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
  apiObjectProps,
  createOtherEstimateItem,
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
  quantity: 45.67,
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
  const res = await client.post({ ...estimate, projectId }, '/estimates', defaultHeaders);
  return res.body as Estimate;
};

const createEstimateItem = async (
  contractItemId: string,
  estimateId: string,
  estimateItem = testEstimateItem
) => {
  const res = await client.post(
    { ...estimateItem, contractItemId, estimateId },
    `/estimate-items`,
    defaultHeaders
  );
  return res.body as EstimateItem;
};

const createProjectContractItemAndEstimate = async (
  project = testProject,
  estimate = testEstimate,
  contractItem = testContractItem
) => {
  const createdProject = await createProject(project);
  const createdContractItem = await createContractItem(createdProject.id, contractItem);
  const createdEstimate = await createEstimate(createdProject.id, estimate);
  return { project: createdProject, contractItem: createdContractItem, estimate: createdEstimate };
};

it('can update all intended properties on estimate-items', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const estimateItem = await createEstimateItem(contractItem.id, estimate.id);

  let res = await client.put({ quantity: 3 }, `/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    contractItemId: expect.any(String),
    estimateId: expect.any(String),
    quantity: 3,
  });
  expect(res.status).toBe(200);
});

it('cannot update properties to invalid values', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const estimateItem = await createEstimateItem(contractItem.id, estimate.id);

  let res = await client.put(
    { quantity: '12' },
    `/estimate-items/${estimateItem.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);

  res = await client.get(`/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    ...estimateItem,
  });
});

it('cannot update estimate-items from other organizations', async () => {
  const estimateItem = await createOtherEstimateItem(client);
  const res = await client.put(
    { quantity: 4 },
    `/estimate-items/${estimateItem.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(404);
});
