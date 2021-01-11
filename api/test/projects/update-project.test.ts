import { Application } from 'express';
import { Project } from '../../src/domain/project/project.entity';
import { headers, initialize, makeClient, TestClient } from '../helpers';

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

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, `/organizations/${orgId}/projects`, defaultHeaders);
  return res.body as Project;
};

it('can update all expected fields of a project', async () => {
  const project = await createProject();

  let res = await client.put({ name: 'new-name' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe('new-name');

  res = await client.put(
    { projectNumber: 'new-project-number' },
    `/projects/${project.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(200);
  expect(res.body.projectNumber).toBe('new-project-number');

  res = await client.put(
    { description: 'new-description' },
    `/projects/${project.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(200);
  expect(res.body.description).toBe('new-description');

  res = await client.put({ client: 'new-client' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(200);
  expect(res.body.client).toBe('new-client');

  res = await client.put({ active: false }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(200);
  expect(res.body.active).toBe(false);

  expect(res.body).toStrictEqual({
    object: 'project',
    id: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
    organization: expect.any(String),
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

  let res = await client.put({ name: 'something-else' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(200);

  res = await client.put(
    { projectNumber: 'other-project' },
    `/projects/${project.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('cannot update unintended fields of a project', async () => {
  const project = await createProject();

  let res = await client.put(
    { organizationId: 'new-id' },
    `/projects/${project.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);

  res = await client.put({ organization: 'new-id' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ object: 'object' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ id: 'new-id' }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ createdAt: 1111 }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ updatedAt: 1111 }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put({ organization: 1111 }, `/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.get(`/projects/${project.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    object: 'project',
    id: expect.any(String),
    organization: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
    ...testProject,
  });
});

it('cannot update other organizations projects', async () => {
  // Create other user's organization
  let res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.otherUser('other-user')
  );
  expect(res.status).toBe(201);
  const otherOrgId = res.body.id;

  // Create other org's project
  res = await client.post(testProject, '/projects', headers.userWithOrg(otherOrgId, 'other-user'));
  expect(res.status).toBe(201);
  const otherProjectId = res.body.id;

  res = await client.put({ name: 'new-name' }, `/projects/${otherProjectId}`, defaultHeaders);
  expect(res.status).toBe(404);
});
