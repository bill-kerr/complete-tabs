import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { EstimateItem } from '../../src/domain/estimate-item/estimate-item.entity';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
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

it('can delete an estimate-item', async () => {
  const { estimate, contractItem } = await createProjectContractItemAndEstimate();
  const estimateItem = await createEstimateItem(contractItem.id, estimate.id);

  let res = await client.delete(`/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.status).toBe(204);

  res = await client.get(`/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});

it('cannot delete an estimate-item from another organization', async () => {
  const otherEstimateItem = await createOtherEstimateItem(client);

  const res = await client.delete(`/estimate-items/${otherEstimateItem.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});
