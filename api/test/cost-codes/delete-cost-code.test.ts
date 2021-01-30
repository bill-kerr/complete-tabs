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

it('can delete a cost-code', async () => {
  const { contractItem } = await createProjectAndContractItem();
  const costCode = await createCostCode(contractItem.id);

  let res = await client.delete(`/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.status).toBe(204);

  res = await client.get(`/cost-codes/${costCode.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});

it('cannot delete a cost-code from another organization', async () => {
  const otherCostCode = await createOtherCostCode(client);

  const res = await client.delete(`/cost-codes/${otherCostCode.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});
