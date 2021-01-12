import { Application } from 'express';
import { ContractItem } from '../../src/domain/contract-item/contract-item.entity';
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
