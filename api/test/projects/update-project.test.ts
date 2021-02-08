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

it('can update all expected fields of a project', async () => {
  const project = await createProject();

  let res = await client.put({ name: 'new-name' }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe('new-name');

  res = await client.put(
    { projectNumber: 'new-project-number' },
    `/projects/${project.id}`,
    headers.default
  );
  expect(res.status).toBe(200);
  expect(res.body.projectNumber).toBe('new-project-number');

  res = await client.put(
    { description: 'new-description' },
    `/projects/${project.id}`,
    headers.default
  );
  expect(res.status).toBe(200);
  expect(res.body.description).toBe('new-description');

  res = await client.put({ client: 'new-client' }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(200);
  expect(res.body.client).toBe('new-client');

  res = await client.put({ active: false }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(200);
  expect(res.body.active).toBe(false);

  expect(res.body).toStrictEqual({
    object: 'project',
    id: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
    userId: expect.any(String),
    name: 'new-name',
    projectNumber: 'new-project-number',
    description: 'new-description',
    client: 'new-client',
    active: false,
  });
});

it('cannot update projectNumber to an already existing one', async () => {
  const project = await createProject();
  await createProject({ ...testProject, projectNumber: 'other-project' });

  let res = await client.put(
    { name: 'something-else' },
    `/projects/${project.id}`,
    headers.default
  );
  expect(res.status).toBe(200);

  res = await client.put(
    { projectNumber: 'other-project' },
    `/projects/${project.id}`,
    headers.default
  );
  expect(res.status).toBe(400);
});

it('cannot update unintended fields of a project', async () => {
  const project = await createProject();

  let res = await client.put({ userId: 'new-id' }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ object: 'object' }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ id: 'new-id' }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ createdAt: 1111 }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ updatedAt: 1111 }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.put({ userId: 1111 }, `/projects/${project.id}`, headers.default);
  expect(res.status).toBe(400);

  res = await client.get(`/projects/${project.id}`, headers.default);
  expect(res.body).toStrictEqual({
    object: 'project',
    id: expect.any(String),
    userId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
    ...testProject,
  });
});

it('cannot update other users projects', async () => {
  // Create other user's project
  let res = await client.post(testProject, '/projects', headers.otherUser());
  expect(res.status).toBe(201);
  const otherProjectId = res.body.id;

  res = await client.put({ name: 'new-name' }, `/projects/${otherProjectId}`, headers.default);
  expect(res.status).toBe(404);
});
