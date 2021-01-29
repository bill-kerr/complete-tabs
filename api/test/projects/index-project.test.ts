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

it('can get a project that belongs the the users current organization', async () => {
  const project = await createProject(testProject);
  const res = await client.get(`/projects/${project.id}`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...testProject,
    object: 'project',
    organizationId: expect.any(String),
    updatedAt: expect.any(Number),
    createdAt: expect.any(Number),
    id: expect.any(String),
  });
  expect(res.status).toBe(200);
});

it('can only get a project that belongs to the users organization', async () => {
  // Create other user's organization
  let res = await client.post({ name: 'other-org' }, '/organizations', headers.otherUser());
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);
  const otherProjectId = res.body.id;

  res = await client.get(
    `/projects/${otherProjectId}`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(200);

  res = await client.get(`/projects/${otherProjectId}`, defaultHeaders);
  expect(res.status).toBe(404);
});

it('returns a 404 when the id does not match', async () => {
  await createProject();
  const res = await client.get(`/projects/does-not-exist`, defaultHeaders);
  expect(res.status).toBe(404);
});
