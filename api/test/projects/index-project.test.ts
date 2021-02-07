import { Application } from 'express';
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

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, `/projects`, headers.default);
  return res.body as Project;
};

it('can get a project', async () => {
  const project = await createProject(testProject);
  const res = await client.get(`/projects/${project.id}`, headers.default);
  expect(res.body).toStrictEqual({
    ...testProject,
    object: 'project',
    userId: expect.any(String),
    updatedAt: expect.any(Number),
    createdAt: expect.any(Number),
    id: expect.any(String),
  });
  expect(res.status).toBe(200);
});

it('can only get a project that belongs to the user', async () => {
  let res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
  const otherProjectId = res.body.id;

  res = await client.get(`/projects/${otherProjectId}`, headers.otherUser());
  expect(res.status).toBe(200);

  res = await client.get(`/projects/${otherProjectId}`, headers.default);
  expect(res.status).toBe(404);
});

it('returns a 404 when the id does not match', async () => {
  await createProject();
  const res = await client.get(`/projects/does-not-exist`, headers.default);
  expect(res.status).toBe(404);
});
