import { Application } from 'express';
import { validation } from '../../src/validation';
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

it('can create a project from the organizations endpoint', async () => {
  const res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...testProject,
    id: expect.any(String),
    object: 'project',
    organizationId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
  expect(res.status).toBe(201);
});

it('can create a project from the projects endpoint', async () => {
  const res = await client.post(testProject, '/projects', defaultHeaders);
  expect(res.body).toStrictEqual({
    ...testProject,
    id: expect.any(String),
    object: 'project',
    organizationId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
  expect(res.status).toBe(201);
});

it('cannot create projects for organizations the user does not belong to', async () => {
  // Create other user's organization
  let res = await client.post({ name: 'other-org' }, '/organizations', headers.otherUser());
  const otherOrgId = res.body.id;

  // Try to create project under other organization
  res = await client.post(testProject, `/organizations/${otherOrgId}`, headers.userWithOrg(orgId));
  expect(res.status).toBe(404);
});

it('it cannot create projects for organizations that do not exist', async () => {
  const res1 = await client.post(testProject, '/projects', headers.userWithOrg('does-not-exist'));
  const res2 = await client.post(
    testProject,
    `/organizations/does-not-exist/projects`,
    headers.userWithOrg('does-not-exist')
  );
  expect(res1.status).toBe(404);
  expect(res2.status).toBe(404);
});

it('cannot create a project with missing required properties', async () => {
  const res = await client.post({}, '/projects', headers.userWithOrg(orgId));
  expect(res.status).toBe(400);

  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.required('name'),
  });

  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.required('projectNumber'),
  });

  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.required('active'),
  });
});

it('cannot create two projects with the same projectNumber', async () => {
  let res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.status).toBe(201);
  res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.status).toBe(400);
});

it('can create a project with same projectNumber if they belong to different organizations', async () => {
  let res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.status).toBe(201);
  res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
  expect(res.status).toBe(400);

  // Create other user's organization
  res = await client.post({ name: 'other-org' }, '/organizations', headers.otherUser());
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'second-user')
  );
  expect(res.status).toBe(201);
});

it('cannot create a project with unintended fields', async () => {
  let res = await client.post(
    { ...testProject, object: 'invalid-property' },
    `/organizations/${orgId}/projects`,
    defaultHeaders
  );
  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.extra('object'),
  });
  expect(res.status).toBe(400);
});
