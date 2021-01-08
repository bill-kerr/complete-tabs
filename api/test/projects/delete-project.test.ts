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

const createProject = async () => {
  const res = await client.post(testProject, '/projects', defaultHeaders);
  return res.body as Project;
};

it('can delete a project', async () => {
  const project = await createProject();
  let res = await client.get(`/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(200);

  res = await client.delete(`/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(204);
  expect(res.body).toStrictEqual({});

  res = await client.get(`/projects/${project.id}`, defaultHeaders);
  expect(res.status).toBe(404);
});

it('cannot delete another organizations projects', async () => {
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
  res = await client.get(
    `/projects/${otherProjectId}`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(200);

  res = await client.delete(`/projects/${otherProjectId}`, defaultHeaders);
  expect(res.status).toBe(404);

  res = await client.get(
    `/projects/${otherProjectId}`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(200);
});
