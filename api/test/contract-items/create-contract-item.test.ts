import { Application } from 'express';
import { Project } from '../../src/domain/project/project.entity';
import { validation } from '../../src/validation';
import {
  apiObjectProps,
  headers,
  initialize,
  makeClient,
  TestClient,
  validationError,
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

const testItem = {
  itemNumber: '9999-9999',
  description: 'test-description',
  quantity: 33.35,
  unit: 'EA',
  unitPrice: 6667,
};

const createProject = async (project: Partial<Project> = testProject) => {
  const res = await client.post(project, '/projects', defaultHeaders);
  return res.body as Project;
};

it('can create a contract-item from the projects endpoint', async () => {
  const project = await createProject();
  const res = await client.post(testItem, `/projects/${project.id}/contract-items`, defaultHeaders);
  expect(res.body).toStrictEqual({
    ...testItem,
    ...apiObjectProps('contract-item'),
  });
  expect(res.status).toBe(201);
});

it('can create a contract-item from the contract-items endpoint', async () => {
  const project = await createProject();
  const res = await client.post(
    { ...testItem, projectId: project.id },
    `/contract-items`,
    defaultHeaders
  );
  expect(res.body).toStrictEqual({
    ...testItem,
    ...apiObjectProps('contract-item'),
  });
  expect(res.status).toBe(201);
});

it('cannot create contract-items for a project that the users organization does not own', async () => {
  // Create other user's organization
  let res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.otherUser('other-user')
  );
  const otherOrgId = res.body.id;

  res = await client.post(
    testProject,
    `/organizations/${otherOrgId}/projects`,
    headers.userWithOrg(otherOrgId, 'other-user')
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testItem, projectId: res.body.id },
    `/contract-items`,
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create contract-items for projects that do no exist', async () => {
  const res = await client.post(
    {
      ...testItem,
      projectId: 'does-not-exist',
    },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(404);
});

it('cannot create a contract-item with missing properties', async () => {
  const project = await createProject();

  let res = await client.post({}, '/contract-items', defaultHeaders);
  expect(res.body.details).toContainEqual(validationError(validation.required('projectId')));
  expect(res.body.details).toContainEqual(validationError(validation.required('itemNumber')));
  expect(res.body.details).toContainEqual(validationError(validation.required('quantity')));
  expect(res.body.details).toContainEqual(validationError(validation.required('unit')));
  expect(res.body.details).toContainEqual(validationError(validation.required('unitPrice')));
  expect(res.status).toBe(400);

  res = await client.post(
    { ...testItem, projectId: project.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);
});

it('cannot create a contract-item with extra properties', async () => {
  const project = await createProject();
  const res = await client.post(
    { ...testProject, projectId: project.id, test: 'should-not-be-here' },
    '/contract-items',
    defaultHeaders
  );
  expect(res.body.details).toContainEqual(validationError(validation.extra('test')));
  expect(res.status).toBe(400);
});

it('cannot create two contract-items with the same itemNumber on the same project', async () => {
  const project = await createProject();
  let res = await client.post(
    { ...testItem, projectId: project.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);
  res = await client.post(
    { ...testItem, projectId: project.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(400);
});

it('is able to create two contract-items with the same number under different projects', async () => {
  const project1 = await createProject();
  const project2 = await createProject({ ...testProject, projectNumber: 'different-number' });

  let res = await client.post(
    { ...testItem, projectId: project1.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);

  res = await client.post(
    { ...testItem, projectId: project2.id },
    '/contract-items',
    defaultHeaders
  );
  expect(res.status).toBe(201);
});
