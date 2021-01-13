import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { CostCode } from '../../src/domain/cost-code/cost-code.entity';
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
  testCostCode,
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

const createCostCode = async (
  contractItemId: string,
  costCode: Partial<CostCode> = testCostCode
) => {
  const res = await client.post({ ...costCode, contractItemId }, '/cost-codes', defaultHeaders);
  return res.body as CostCode;
};

const createProjectAndContractItem = async () => {
  const project = await createProject();
  const contractItem = await createContractItem(project.id);
  return { project, contractItem };
};

it('can create a cost-code via the contract-items endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const res = await client.post(
    testCostCode,
    `/contract-items/${contractItem.id}/cost-codes`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('cost-code'),
    ...testCostCode,
    contractItem: contractItem.id,
  });
  expect(res.status).toBe(201);
});

it('can create a cost-code via the cost-codes endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    `/cost-codes`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('cost-code'),
    ...testCostCode,
    contractItem: contractItem.id,
  });
  expect(res.status).toBe(201);
});

it('cannot create cost-codes for a contract-item that the users organization does not own', async () => {
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

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    otherHeaders
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create a cost-code for contract-items that do not exist', async () => {
  const res = await client.post(
    { ...testCostCode, contractItemId: 'does-not-exist' },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create a cost-code with missing properties', async () => {
  let res = await client.post({}, '/cost-codes', defaultHeaders);
  expect(res.body.details).toContainEqual(validationError(validation.required('description')));
  expect(res.body.details).toContainEqual(validationError(validation.required('quantity')));
  expect(res.body.details).toContainEqual(validationError(validation.required('contractItemId')));
  expect(res.status).toBe(400);
});

it('cannot create a cost-code with invalid properties', async () => {
  const res = await client.post(
    {
      code: 444,
      description: 43,
      quantity: '45',
      unit: 1,
      laborHours: '2',
      equipmentHours: '1',
      laborBudget: 23.43,
      equipmentBudget: 33.45,
      contractItemId: 45,
    },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.body.details).toContainEqual(validationError(validation.string('code')));
  expect(res.body.details).toContainEqual(validationError(validation.string('description')));
  expect(res.body.details).toContainEqual(validationError(validation.number('quantity')));
  expect(res.body.details).toContainEqual(validationError(validation.string('unit')));
  expect(res.body.details).toContainEqual(validationError(validation.number('laborHours')));
  expect(res.body.details).toContainEqual(validationError(validation.number('equipmentHours')));
  expect(res.body.details).toContainEqual(validationError(validation.integer('laborBudget')));
  expect(res.body.details).toContainEqual(validationError(validation.integer('equipmentBudget')));
  expect(res.body.details).toContainEqual(validationError(validation.string('contractItemId')));
  expect(res.status).toBe(400);
});

it('cannot create a cost-code with extra properties', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id, test: 'should-not-be-here' },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.body.details).toContainEqual(validationError(validation.extra('test')));
  expect(res.status).toBe(400);
});

it('cannot create two cost-codes with the same code under the same project', async () => {
  const { contractItem } = await createProjectAndContractItem();

  let res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('is able to create two cost-codes with the same code under different projects', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createCostCode(contractItem.id);

  let res = await client.post(
    { ...testProject, projectNumber: 'other-proj' },
    '/projects',
    defaultHeaders
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testContractItem, itemNumber: 'different-item-number', projectId: res.body.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    defaultHeaders
  );
  expect(res.status).toBe(201);
});
