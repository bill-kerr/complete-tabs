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

it('can list projects that belong to the users current organization', async () => {
  await createProject(testProject);
  await createProject({ ...testProject, projectNumber: 'other-project-number' });
  let res = await client.get(`/projects`, defaultHeaders);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);

  res = await client.get(`/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.body.data).toHaveLength(2);
  expect(res.status).toBe(200);
});

it('returns an empty list if no projects exist', async () => {
  const res = await client.get(`/projects`, defaultHeaders);
  expect(res.body.data).toHaveLength(0);
  expect(res.status).toBe(200);
});

it('does not list projects from other organizations', async () => {
  // Create other user's organization
  let res = await client.post({ name: 'other-org' }, '/organizations', headers.otherUser());
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.get('/projects', defaultHeaders);
  expect(res.body.data).toHaveLength(0);
});
