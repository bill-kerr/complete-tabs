import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { CostCode } from '../../src/domain/cost-code/cost-code.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
  apiObjectProps,
  headers,
  initialize,
  makeClient,
  TestClient,
  testContractItem,
  testCostCode,
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

it('can update all intended properties on a cost-code', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);

  let res = await client.put({ code: 'new-code' }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.code).toBe('new-code');

  res = await client.put(
    { description: 'new-description' },
    `/cost-codes/${costCode.id}`,
    defaultHeaders
  );
  expect(res.body.description).toBe('new-description');

  res = await client.put({ quantity: 789456 }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.quantity).toBe(789456);

  res = await client.put({ unit: 'new-unit' }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.unit).toBe('new-unit');

  res = await client.put({ laborHours: 123456 }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.laborHours).toBe(123456);

  res = await client.put({ equipmentHours: 123456 }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.equipmentHours).toBe(123456);

  res = await client.put({ laborBudget: 123456 }, `/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.body.laborBudget).toBe(123456);

  res = await client.put({ equipmentBudget: 123456 }, `/cost-codes/${costCode.id}`, defaultHeaders);
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
    defaultHeaders
  );
  expect(res.status).toBe(400);
});
