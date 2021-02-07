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

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
});

const testEstimateItem = {
  quantity: 45.67,
};

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

const createEstimate = async (projectId: string, estimate = testEstimate) => {
  const res = await client.post({ ...estimate, projectId }, '/estimates', headers.default);
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
    headers.default
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

it('can list estimate-items via the estimate-items endpoint', async () => {
  const { estimate, contractItem } = await createProjectContractItemAndEstimate();
  await createEstimateItem(contractItem.id, estimate.id);
  await createEstimateItem(contractItem.id, estimate.id);

  const res = await client.get('/estimate-items', headers.default);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('can list estimate-items via the contract-items endpoint', async () => {
  const { estimate, contractItem } = await createProjectContractItemAndEstimate();
  await createEstimateItem(contractItem.id, estimate.id);
  await createEstimateItem(contractItem.id, estimate.id);

  const res = await client.get(
    `/contract-items/${contractItem.id}/estimate-items`,
    headers.default
  );
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('can list estimate-items via the estimates endpoint', async () => {
  const { estimate, contractItem } = await createProjectContractItemAndEstimate();
  await createEstimateItem(contractItem.id, estimate.id);
  await createEstimateItem(contractItem.id, estimate.id);

  const res = await client.get(`/estimates/${estimate.id}/estimate-items`, headers.default);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('only retrieves estimate-items for the given contract-item', async () => {
  let res = await createProjectContractItemAndEstimate();
  const contractItemId = res.contractItem.id;
  await createEstimateItem(res.contractItem.id, res.estimate.id);
  const estimateId = res.estimate.id;
  res = await createProjectContractItemAndEstimate(
    { ...testProject, projectNumber: 'new-project' },
    { ...testEstimate, estimateNumber: 'new-number' },
    { ...testContractItem, itemNumber: 'new-item-number' }
  );
  await createEstimateItem(res.contractItem.id, estimateId);

  let response = await client.get(
    `/contract-items/${contractItemId}/estimate-items`,
    headers.default
  );
  expect(response.body.data).toHaveLength(1);
  expect(response.status).toBe(200);

  response = await client.get('/estimate-items', headers.default);
  expect(response.body.data).toHaveLength(2);
});

it('only retrieves estimate-items for the given estimate', async () => {
  let res = await createProjectContractItemAndEstimate();
  const contractItemId = res.contractItem.id;
  const estimateId = res.estimate.id;
  await createEstimateItem(contractItemId, res.estimate.id);

  res = await createProjectContractItemAndEstimate(
    { ...testProject, projectNumber: 'new-project' },
    { ...testEstimate, estimateNumber: 'new-number' },
    { ...testContractItem, itemNumber: 'new-item-number' }
  );
  await createEstimateItem(contractItemId, res.estimate.id);

  let response = await client.get(`/estimates/${estimateId}/estimate-items`, headers.default);
  expect(response.body.data).toHaveLength(1);
  expect(response.status).toBe(200);

  response = await client.get('/estimate-items', headers.default);
  expect(response.body.data).toHaveLength(2);
});

it('returns an empty list if no estimate-items exist', async () => {
  const res = await client.get('/estimate-items', headers.default);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});

it('does not list estimate-items from other users', async () => {
  await createOtherEstimateItem(client);
  const res = await client.get('/estimate-items', headers.default);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});
