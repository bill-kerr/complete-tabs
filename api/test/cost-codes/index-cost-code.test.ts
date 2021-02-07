import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
import { CostCode } from '../../src/domain/cost-code/cost-code.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
  createOtherCostCode,
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

it('can get a cost-code', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);

  const res = await client.get(`/cost-codes/${costCode.id}`, headers.default);
  expect(res.body).toStrictEqual(costCode);
  expect(res.status).toBe(200);
});

it('returns a 404 when the cost-code does not exist', async () => {
  const res = await client.get('/cost-codes/does-not-exist', headers.default);
  expect(res.body).toStrictEqual({
    object: 'error',
    name: 'Not Found Error',
    statusCode: 404,
    details: 'The requested resource was not found.',
  });
  expect(res.status).toBe(404);
});

it('can only get cost-codes belonging to the users organizaiton', async () => {
  const otherCostCode = await createOtherCostCode(client);
  const res = await client.get(`/cost-codes/${otherCostCode.id}`, headers.default);
  expect(res.status).toBe(404);
});
