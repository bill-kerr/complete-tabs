import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { validation } from '../../src/validation';
import {
  apiObjectProps,
  createOrganization,
  headers,
  initialize,
  makeClient,
  TestClient,
  testContractItem,
  testEstimate,
  testProject,
  validationError,
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

const createProjectContractItemAndEstimate = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  const estimate = await createEstimate(project.id);
  return { project, contractItem, estimate };
};

it('can create an estimate-item via the contract-items endpoint', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const res = await client.post(
    { ...testEstimateItem, estimateId: estimate.id },
    `/contract-items/${contractItem.id}/estimate-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    ...testEstimateItem,
    estimateId: expect.any(String),
    contractItemId: expect.any(String),
  });
  expect(res.status).toBe(201);
});

it('can create an estimate-item via the estimates endpoint', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const res = await client.post(
    { ...testEstimateItem, contractItemId: contractItem.id },
    `/estimates/${estimate.id}/estimate-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    ...testEstimateItem,
    estimateId: expect.any(String),
    contractItemId: expect.any(String),
  });
  expect(res.status).toBe(201);
});

it('can create an estimate-item via the estimate-items endpoint', async () => {
  const { contractItem, estimate } = await createProjectContractItemAndEstimate();
  const res = await client.post(
    { ...testEstimateItem, contractItemId: contractItem.id, estimateId: estimate.id },
    '/estimate-items',
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate-item'),
    ...testEstimateItem,
    estimateId: expect.any(String),
    contractItemId: expect.any(String),
  });
  expect(res.status).toBe(201);
});

it('cannot create estimate-items for a contract-item that the users organization does not own', async () => {
  const otherOrg = await createOrganization(client);
  const otherHeaders = headers.userWithOrg(otherOrg.id, 'other-user');
  let res = await client.post(testProject, `/organizations/${otherOrg.id}/projects`, otherHeaders);
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    testContractItem,
    `/projects/${otherProject.id}/contract-items`,
    otherHeaders
  );
  expect(res.status).toBe(201);
  const contractItemId = res.body.id;

  res = await client.post(testEstimate, `/projects/${otherProject.id}/estimates`, otherHeaders);
  expect(res.status).toBe(201);
  const estimateId = res.body.id;

  res = await client.post(
    { ...testEstimateItem, contractItemId, estimateId },
    '/estimate-items',
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create estimate-items for contract-items that do not exist', async () => {
  const { estimate } = await createProjectContractItemAndEstimate();

  let res = await client.post(
    { ...testEstimateItem, contractItemId: 'does-not-exist', estimateId: estimate.id },
    `/estimate-items`,
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create estimate-items for estimates that do not exist', async () => {
  const { contractItem } = await createProjectContractItemAndEstimate();

  let res = await client.post(
    { ...testEstimateItem, contractItemId: contractItem.id, estimateId: 'does-not-exist' },
    `/estimate-items`,
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create an estimate-item with missing properties', async () => {
  const res = await client.post({}, '/estimate-items', defaultHeaders);
  expect(res.body.details).toContainEqual(validationError(validation.required('contractItemId')));
  expect(res.body.details).toContainEqual(validationError(validation.required('estimateId')));
  expect(res.body.details).toContainEqual(validationError(validation.required('quantity')));
  expect(res.status).toBe(400);
});

it('cannot create an estimate-item with extra properties', async () => {
  const { estimate, contractItem } = await createProjectContractItemAndEstimate();
  const res = await client.post(
    {
      ...testEstimateItem,
      contractItemId: contractItem.id,
      estimateId: estimate.id,
      test: 'extra',
    },
    '/estimate-items'
  );
  expect(res.body.details).toContainEqual(validationError(validation.extra('test')));
  expect(res.status).toBe(400);
});

it('cannot create an estimate-item with invalid properties', async () => {
  const res = await client.post(
    { quantity: '12', contractItemId: 12, estimateId: 12 },
    '/estimate-items',
    defaultHeaders
  );
  expect(res.body.details).toContainEqual(validationError(validation.number('quantity')));
  expect(res.body.details).toContainEqual(validationError(validation.string('contractItemId')));
  expect(res.body.details).toContainEqual(validationError(validation.string('estimateId')));
  expect(res.status).toBe(400);
});
