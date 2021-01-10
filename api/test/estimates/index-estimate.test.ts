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

it('returns a 404 when the estimate does not exist', async () => {
  const res = await client.get('/estimates/does-not-exist', defaultHeaders);
  expect(res.body).toStrictEqual({
    object: 'error',
    name: 'Not Found Error',
    statusCode: 404,
    details: 'The requested resource was not found.',
  });
  expect(res.status).toBe(404);
});

it('can only get estimates that belong to the users organization', async () => {
  // Create other user's organization
  let res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.otherUser('other-user')
  );
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testEstimate, projectId: res.body.id },
    '/estimates',
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.get(
    `/estimates/${res.body.id}`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(200);

  res = await client.get(`/estimates/${res.body.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});
