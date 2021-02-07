import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { headers, initialize, makeClient, TestClient } from '../helpers';

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

it('can delete an estimate', async () => {
  const project = await createProject();
  const item = await createEstimate(project.id);

  let res = await client.delete(`/estimates/${item.id}`, headers.default);
  expect(res.status).toBe(204);
  expect(res.body).toStrictEqual({});

  res = await client.get(`/estimates/${item.id}`, headers.default);
  expect(res.status).toBe(404);
});

it('cannot delete an estimate from another user', async () => {
  let res = await client.post(testProject, '/projects', headers.otherUser());
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testEstimate, projectId: res.body.id },
    '/estimates',
    headers.otherUser()
  );
  expect(res.status).toBe(201);
  const estimateId = res.body.id;

  res = await client.delete(`/estimates/${estimateId}`, headers.default);
  expect(res.status).toBe(404);

  res = await client.get(`/estimates/${estimateId}`, headers.otherUser());
  expect(res.body.id).toBe(estimateId);
  expect(res.status).toBe(200);
});
