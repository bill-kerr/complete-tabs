import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { apiObjectProps, headers, initialize, makeClient, TestClient } from '../helpers';

let app: Application;
let client: TestClient;

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
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
  const res = await client.post(project, '/projects', headers.default);
  return res.body as Project;
};

const createEstimate = async (
  projectId: string,
  estimate: Partial<TestEstimate> = testEstimate
) => {
  const res = await client.post({ ...estimate, projectId }, '/estimates', headers.default);
  return res.body as Estimate;
};

it('can get an estimate', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  const res = await client.get(`/estimates/${estimate.id}`, headers.default);
  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate'),
    ...estimate,
  });
  expect(res.status).toBe(200);
});

it('returns a 404 when the estimate does not exist', async () => {
  const res = await client.get('/estimates/does-not-exist', headers.default);
  expect(res.body).toStrictEqual({
    object: 'error',
    name: 'Not Found Error',
    statusCode: 404,
    details: 'The requested resource was not found.',
  });
  expect(res.status).toBe(404);
});

it('can only get estimates that belong to the user', async () => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testEstimate, projectId: res.body.id },
    '/estimates',
    headers.otherUser()
  );
  expect(res.status).toBe(201);

  res = await client.get(`/estimates/${res.body.id}`, headers.otherUser());
  expect(res.status).toBe(200);

  res = await client.get(`/estimates/${res.body.id}`, headers.default);
  expect(res.status).toBe(404);
});
