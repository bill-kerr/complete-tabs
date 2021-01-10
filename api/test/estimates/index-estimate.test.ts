import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { apiObjectProps, headers, initialize, makeClient, TestClient } from '../helpers';

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

it('can get an estimate', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  const res = await client.get(`/estimates/${estimate.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate'),
    ...estimate,
  });
  expect(res.status).toBe(200);
});
