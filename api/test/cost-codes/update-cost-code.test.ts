import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { CostCode } from '../../src/domain/cost-code/cost-code.entity';
import { Project } from '../../src/domain/project/project.entity';
import { validation } from '../../src/validation';
import {
  apiObjectProps,
  createOtherCostCode,
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

it('can update all intended properties on a cost-code', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);

  let res = await client.put({ code: 'new-code' }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.code).toBe('new-code');

  res = await client.put(
    { description: 'new-description' },
    `/cost-codes/${costCode.id}`,
    headers.default
  );
  expect(res.body.description).toBe('new-description');

  res = await client.put({ quantity: 789456 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.quantity).toBe(789456);

  res = await client.put({ unit: 'new-unit' }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.unit).toBe('new-unit');

  res = await client.put({ laborHours: 123456 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.laborHours).toBe(123456);

  res = await client.put({ equipmentHours: 123456 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.equipmentHours).toBe(123456);

  res = await client.put({ laborBudget: 123456 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.laborBudget).toBe(123456);

  res = await client.put(
    { equipmentBudget: 123456 },
    `/cost-codes/${costCode.id}`,
    headers.default
  );
  expect(res.body.equipmentBudget).toBe(123456);

  expect(res.body).toStrictEqual({
    ...apiObjectProps('cost-code'),
    code: 'new-code',
    quantity: 789456,
    description: 'new-description',
    unit: 'new-unit',
    laborHours: 123456,
    equipmentHours: 123456,
    laborBudget: 123456,
    equipmentBudget: 123456,
    contractItemId: expect.any(String),
  });
  expect(res.status).toBe(200);
});

it('cannot update a cost-codes code to an existing one in the project', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);
  await createCostCode(contractItem.id, { ...testCostCode, code: 'other-code' });

  const res = await client.put(
    { code: 'other-code' },
    `/cost-codes/${costCode.id}`,
    headers.default
  );
  expect(res.status).toBe(400);
});

it('cannot update properties to invalid values', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);

  let res = await client.put({ code: 1234 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.string('code')));

  res = await client.put({ quantity: '56896' }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.number('quantity')));

  res = await client.put({ description: true }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.string('description')));

  res = await client.put({ unit: 1234 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.string('unit')));

  res = await client.put({ laborHours: '1234.5' }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.number('laborHours')));

  res = await client.put(
    { equipmentHours: '1234.5' },
    `/cost-codes/${costCode.id}`,
    headers.default
  );
  expect(res.body.details).toContainEqual(validationError(validation.number('equipmentHours')));

  res = await client.put({ laborBudget: 125.6 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.integer('laborBudget')));

  res = await client.put({ equipmentBudget: 125.6 }, `/cost-codes/${costCode.id}`, headers.default);
  expect(res.body.details).toContainEqual(validationError(validation.integer('equipmentBudget')));

  res = await client.get(`/cost-codes/${costCode.id}`, headers.default);
  expect(res.body).toStrictEqual(costCode);
});

it('cannot update cost-codes from other users', async () => {
  const costCode = await createOtherCostCode(client);
  const res = await client.put(
    { code: 'some-new-code' },
    `/cost-codes/${costCode.id}`,
    headers.default
  );
  expect(res.status).toBe(404);
});
