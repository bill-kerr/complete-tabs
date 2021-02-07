import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { CostCode } from '../../src/domain/cost-code/cost-code.entity';
import { Project } from '../../src/domain/project/project.entity';
import { validation } from '../../src/validation';
import {
  apiObjectProps,
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

const createCostCode = async (
  contractItemId: string,
  costCode: Partial<CostCode> = testCostCode
) => {
  const res = await client.post({ ...costCode, contractItemId }, '/cost-codes', headers.default);
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
    headers.default
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('cost-code'),
    ...testCostCode,
    contractItemId: contractItem.id,
  });
  expect(res.status).toBe(201);
});

it('can create a cost-code via the cost-codes endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    `/cost-codes`,
    headers.default
  );
  expect(res.body).toStrictEqual({
    ...apiObjectProps('cost-code'),
    ...testCostCode,
    contractItemId: contractItem.id,
  });
  expect(res.status).toBe(201);
});

it('cannot create cost-codes for a contract-item that the user does not own', async () => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    testContractItem,
    `/projects/${otherProject.id}/contract-items`,
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    headers.default
  );
  expect(res.status).toBe(404);
});

it('cannot create a cost-code for contract-items that do not exist', async () => {
  const res = await client.post(
    { ...testCostCode, contractItemId: 'does-not-exist' },
    '/cost-codes',
    headers.default
  );
  expect(res.status).toBe(404);
});

it('cannot create a cost-code with missing properties', async () => {
  let res = await client.post({}, '/cost-codes', headers.default);
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
    headers.default
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
    headers.default
  );
  expect(res.body.details).toContainEqual(validationError(validation.extra('test')));
  expect(res.status).toBe(400);
});

it('cannot create two cost-codes with the same code under the same project', async () => {
  const { contractItem } = await createProjectAndContractItem();

  let res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    '/cost-codes',
    headers.default
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: contractItem.id },
    '/cost-codes',
    headers.default
  );
  expect(res.status).toBe(400);
});

it('is able to create two cost-codes with the same code under different projects', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createCostCode(contractItem.id);

  let res = await client.post(
    { ...testProject, projectNumber: 'other-proj' },
    '/projects',
    headers.default
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testContractItem, itemNumber: 'different-item-number', projectId: res.body.id },
    '/contract-items',
    headers.default
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testCostCode, contractItemId: res.body.id },
    '/cost-codes',
    headers.default
  );
  expect(res.status).toBe(201);
});
