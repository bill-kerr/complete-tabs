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

const createProject = async () => {
  const res = await client.post(testProject, '/projects', headers.default);
  return res.body as Project;
};

it('can delete a project', async () => {
  const project = await createProject();
  let res = await client.get(`/projects/${project.id}`, headers.default);
  expect(res.status).toBe(200);

  res = await client.delete(`/projects/${project.id}`, headers.default);
  expect(res.status).toBe(204);
  expect(res.body).toStrictEqual({});

  res = await client.get(`/projects/${project.id}`, headers.default);
  expect(res.status).toBe(404);
});

it('cannot delete another users projects', async () => {
  // Create other user's project
  let res = await client.post(testProject, '/projects', headers.otherUser());
  expect(res.status).toBe(201);
  const otherProjectId = res.body.id;
  res = await client.get(`/projects/${otherProjectId}`, headers.otherUser());
  expect(res.status).toBe(200);

  res = await client.delete(`/projects/${otherProjectId}`, headers.default);
  expect(res.status).toBe(404);

  res = await client.get(`/projects/${otherProjectId}`, headers.otherUser());
  expect(res.status).toBe(200);
});

it('deleting a project deletes all contract-items as well', async () => {
  const project = await createProject();
  let res = await client.post(
    {
      itemNumber: 'test-item',
      description: 'test-description',
      quantity: 1,
      unit: 'EA',
      unitPrice: 1,
      projectId: project.id,
    },
    '/contract-items',
    headers.default
  );
  expect(res.status).toBe(201);
  const itemId = res.body.id;

  res = await client.delete(`/projects/${project.id}`, headers.default);
  expect(res.status).toBe(204);

  res = await client.get(`/contract-items/${itemId}`, headers.default);
  expect(res.status).toBe(404);
});

it('deleting a project deletes all estimates as well', async () => {
  const project = await createProject();
  let res = await client.post(
    {
      estimateNumber: 'test-number',
      periodEnding: '2020-01-05',
      projectId: project.id,
    },
    '/estimates',
    headers.default
  );
  expect(res.status).toBe(201);
  const estimateId = res.body.id;

  res = await client.delete(`/projects/${project.id}`, headers.default);
  expect(res.status).toBe(204);

  res = await client.get(`/estimates/${estimateId}`, headers.default);
  expect(res.status).toBe(404);
});
