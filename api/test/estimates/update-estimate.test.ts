import { Application } from 'express';
import { Estimate } from '../../src/domain/estimate/estimate.entity';
import { Project } from '../../src/domain/project/project.entity';
import {
  apiObjectProps,
  createOrganization,
  headers,
  initialize,
  makeClient,
  TestClient,
} from '../helpers';

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

const testEstimate = {
  estimateNumber: '1',
  periodEnding: '2021-01-09',
};
type TestEstimate = typeof testEstimate;

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

const createEstimate = async (
  projectId: string,
  estimate: Partial<TestEstimate> = testEstimate
) => {
  const res = await client.post({ ...estimate, projectId }, '/estimates', defaultHeaders);
  return res.body as Estimate;
};

it('can update all expected fields of an estimate', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  let res = await client.put(
    { estimateNumber: 'new-estimate-number' },
    `/estimates/${estimate.id}`,
    defaultHeaders
  );
  expect(res.body.estimateNumber).toBe('new-estimate-number');
  expect(res.status).toBe(200);

  res = await client.put(
    { periodEnding: '2021-05-01' },
    `/estimates/${estimate.id}`,
    defaultHeaders
  );
  expect(res.body.periodEnding).toBe('2021-05-01');
  expect(res.status).toBe(200);

  expect(res.body).toStrictEqual({
    ...apiObjectProps('estimate'),
    estimateNumber: 'new-estimate-number',
    periodEnding: '2021-05-01',
  });
});

it('cannot update estimateNumber to an already existing one', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);
  await createEstimate(project.id, { ...testEstimate, estimateNumber: 'other-estimate-number' });

  const res = await client.put(
    { estimateNumber: 'other-estimate-number' },
    `/estimates/${estimate.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('cannot update properties to invalid values', async () => {
  const project = await createProject();
  const estimate = await createEstimate(project.id);

  let res = await client.put({ estimateNumber: 3333 }, `/estimates/${estimate.id}`, defaultHeaders);
  expect(res.status).toBe(400);

  res = await client.put(
    { periodEnding: '2020-00-23' },
    `/estimates/${estimate.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);

  res = await client.put(
    { periodEnding: '2020-01-32' },
    `/estimates/${estimate.id}`,
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('cannot update estiamtes from other organizations', async () => {
  const otherOrg = await createOrganization(client);
  const otherHeader = headers.userWithOrg(otherOrg.id, 'other-user');

  let res = await client.post(testProject, '/projects', otherHeader);
  expect(res.status).toBe(201);

  res = await client.post({ ...testEstimate, projectId: res.body.id }, '/estimates', otherHeader);
  expect(res.status).toBe(201);
  const estimateId = res.body.id;

  res = await client.put(
    { periodEnding: '2021-05-01' },
    `/estimates/${estimateId}`,
    defaultHeaders
  );
  expect(res.status).toBe(404);
});
