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

const createProjectContractItemAndEstimate = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  const estimate = await createEstimate(project.id);
  return { project, contractItem, estimate };
};

it('can get an estimate-item', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const estimateItem = await createEstimateItem(contractItem.id, estimate.id);
  const res = await client.get(`/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.body).toStrictEqual(estimateItem);
  expect(res.status).toBe(200);
});

it('returns a 404 when the estimate-item does not exist', async () => {
  const res = await client.get('/estimate-items/does-not-exist', defaultHeaders);
  expect(res.body).toStrictEqual({
    object: 'error',
    name: 'Not Found Error',
    statusCode: 404,
    details: 'The requested resource was not found.',
  });
  expect(res.status).toBe(404);
});

it('can only get estimate-items belonging to the users organization', async () => {
  const estimateItem = await createOtherEstimateItem(client);
  const res = await client.get(`/estimate-items/${estimateItem.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});
