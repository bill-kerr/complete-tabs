import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { createOrganization, headers, initialize, makeClient, TestClient } from '../helpers';

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

const testProject = {
  name: 'test-project',
  projectNumber: 'test-project-number',
  description: 'This is a test project',
  client: 'test-client',
  active: true,
};

const testEstimate = {
  estimateNumber: '1',
  periodEnding: '2021-01-09',
};
type TestEstimate = typeof testEstimate;

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

const createEstimate = async (
  projectId: string,
  estimate: Partial<TestEstimate> = testEstimate
) => {
  const res = await client.post({ ...estimate, projectId }, '/estimates', defaultHeaders);
  return res.body as Estimate;
};

it('can list estimates', async () => {
  const project = await createProject();
  await createEstimate(project.id);
  await createEstimate(project.id, { ...testEstimate, estimateNumber: 'other-est-num' });

  const res = await client.get('/estimates', defaultHeaders);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('returns an empty list if no estimates exist', async () => {
  const res = await client.get('/estimates', defaultHeaders);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});

it('does not list estimates from other organizations', async () => {
  const otherOrg = await createOrganization(client);
  const otherHeader = headers.userWithOrg(otherOrg.id, 'other-user');

  let res = await client.post(testProject, '/projects', otherHeader);
  expect(res.status).toBe(201);

  res = await client.post({ ...testEstimate, projectId: res.body.id }, `/estimates`, otherHeader);
  expect(res.status).toBe(201);

  res = await client.get(`/estimates`, otherHeader);
  expect(res.body.data).toHaveLength(1);

  res = await client.get('/contract-items', defaultHeaders);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});
