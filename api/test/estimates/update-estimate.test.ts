import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import { apiObjectProps, headers, initialize, makeClient, TestClient } from '../helpers';

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

const testEstimate = {
  estimateNumber: '1',
  periodEnding: '2021-01-09',
};
type TestEstimate = typeof testEstimate;

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', headers.default);
  return res.body as Project;
};

const createEstimate = async (
  projectId: string,
  estimate: Partial<TestEstimate> = testEstimate
) => {
  const res = await client.post({ ...estimate, projectId }, '/estimates', headers.default);
  return res.body as Estimate;
};

it('can update all expected fields of an estimate', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  let res = await client.put(
    { estimateNumber: 'new-estimate-number' },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.body.estimateNumber).toBe('new-estimate-number');
  expect(res.status).toBe(200);

  res = await client.put(
    { periodEnding: '2021-05-01' },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.body.periodEnding).toBe('2021-05-01');
  expect(res.status).toBe(200);

  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate'),
    estimateNumber: 'new-estimate-number',
    periodEnding: '2021-05-01',
    projectId: expect.any(String),
  });
});

it('cannot update estimateNumber to an already existing one', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);
  await createEstimate(project.id, { ...testEstimate, estimateNumber: 'other-estimate-number' });

  const res = await client.put(
    { estimateNumber: 'other-estimate-number' },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.status).toBe(400);
});

it('cannot update properties to invalid values', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  let res = await client.put(
    { estimateNumber: 3333 },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.status).toBe(400);

  res = await client.put(
    { periodEnding: '2020-00-23' },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.status).toBe(400);

  res = await client.put(
    { periodEnding: '2020-01-32' },
    `/estimates/${estimate.id}`,
    headers.default
  );
  expect(res.status).toBe(400);
});

it('cannot update estiamtes from other users', async () => {
  let res = await client.post(testProject, '/projects', headers.otherUser());
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testEstimate, projectId: res.body.id },
    '/estimates',
    headers.otherUser()
  );
  expect(res.status).toBe(201);
  const estimateId = res.body.id;

  res = await client.put(
    { periodEnding: '2021-05-01' },
    `/estimates/${estimateId}`,
    headers.default
  );
  expect(res.status).toBe(404);
});
