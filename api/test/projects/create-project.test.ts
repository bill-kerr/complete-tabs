import { Application } from 'express';
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

// it('can create a project from the organizations endpoint', async () => {
//   const res = await client.post(testProject, `/organizations/${orgId}/projects`, defaultHeaders);
//   expect(res.body).toStrictEqual({
//     ...testProject,
//     id: expect.any(String),
//     object: 'project',
//     createdAt: expect.any(Number),
//     updatedAt: expect.any(Number),
//   });
//   expect(res.status).toBe(201);
// });

it('can create a project from the projects endpoint', async () => {
  console.log(orgId);
  const res = await client.post(
    { ...testProject, organizationId: orgId },
    '/projects',
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...testProject,
    id: expect.any(String),
    object: 'project',
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
  expect(res.status).toBe(201);
});
