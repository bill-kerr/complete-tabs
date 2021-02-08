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

it('can list cost-codes via the cost-codes endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createCostCode(contractItem.id);
  await createCostCode(contractItem.id, { ...testCostCode, code: 'another-code' });

  const res = await client.get('/cost-codes', headers.default);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('can list cost-codes via the contract-items endpoint', async () => {
  const { contractItem } = await createProjectAndContractItem();
  await createCostCode(contractItem.id);
  await createCostCode(contractItem.id, { ...testCostCode, code: 'another-code' });

  const res = await client.get(`/contract-items/${contractItem.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('can list cost-codes via the projects endpoint', async () => {
  const { project, contractItem } = await createProjectAndContractItem();
  await createCostCode(contractItem.id);
  await createCostCode(contractItem.id, { ...testCostCode, code: 'another-code' });

  const res = await client.get(`/projects/${project.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('only lists cost-codes for the specified contract-item', async () => {
  const { contractItem, project } = await createProjectAndContractItem();
  let res = await client.post(
    { ...testContractItem, itemNumber: '2222-2222' },
    `/projects/${project.id}/contract-items`,
    headers.default
  );
  expect(res.status).toBe(201);

  await createCostCode(contractItem.id);
  await createCostCode(res.body.id);

  res = await client.get(`/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(2);

  res = await client.get(`/contract-items/${contractItem.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(1);
  expect(res.status).toBe(200);
});

it('only lists cost-codes for the specified project', async () => {
  const { project, contractItem } = await createProjectAndContractItem();
  let res = await client.post(
    { ...testProject, projectNumber: 'new-project' },
    '/projects',
    headers.default
  );
  expect(res.status).toBe(201);
  const otherProject = res.body;

  res = await client.post(
    { ...testContractItem },
    `/projects/${otherProject.id}/contract-items`,
    headers.default
  );
  expect(res.status).toBe(201);
  const otherContractItem = res.body;

  await createCostCode(contractItem.id);
  await createCostCode(otherContractItem.id, { ...testCostCode, code: 'new-code' });

  res = await client.get('/cost-codes', headers.default);
  expect(res.body.data).toHaveLength(2);

  res = await client.get(`/projects/${project.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(1);
  expect(res.status).toBe(200);
});

it('returns an empty list if no cost-codes exist', async () => {
  const res = await client.get('/cost-codes', headers.default);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});

it('does not list cost-codes from other users', async () => {
  await createOtherCostCode(client);
  const { project, contractItem } = await createProjectAndContractItem();

  let res = await client.get('/cost-codes', headers.default);
  expect(res.body.data).toHaveLength(0);

  res = await client.get(`/contract-items/${contractItem.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(0);

  res = await client.get(`/projects/${project.id}/cost-codes`, headers.default);
  expect(res.body.data).toHaveLength(0);
});
