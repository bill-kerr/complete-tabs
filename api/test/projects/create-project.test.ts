import { Application } from 'express';
import { validation } from '../../src/validation';
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

it('can create a project from the organizations endpoint', async () => {
  const res = await client.post(testProject, `/projects`, headers.default);
  expect(res.body).toStrictEqual({
    ...testProject,
    id: expect.any(String),
    object: 'project',
    userId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
  expect(res.status).toBe(201);
});

it('can create a project from the projects endpoint', async () => {
  const res = await client.post(testProject, '/projects', headers.default);
  expect(res.body).toStrictEqual({
    ...testProject,
    id: expect.any(String),
    object: 'project',
    userId: expect.any(String),
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
  expect(res.status).toBe(201);
});

it('cannot create a project with missing required properties', async () => {
  const res = await client.post({}, '/projects', headers.default);
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
  let res = await client.post(testProject, `/projects`, headers.default);
  expect(res.status).toBe(201);
  res = await client.post(testProject, `/projects`, headers.default);
  expect(res.status).toBe(400);
});

it('can create a project with same projectNumber if they belong to different users', async () => {
  let res = await client.post(testProject, `/projects`, headers.default);
  expect(res.status).toBe(201);
  res = await client.post(testProject, `/projects`, headers.default);
  expect(res.status).toBe(400);

  res = await client.post(testProject, `/projects`, headers.otherUser());
  expect(res.status).toBe(201);
});

it('cannot create a project with unintended fields', async () => {
  let res = await client.post(
    { ...testProject, object: 'invalid-property' },
    `/projects`,
    headers.default
  );
  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.extra('object'),
  });
  expect(res.status).toBe(400);
});
