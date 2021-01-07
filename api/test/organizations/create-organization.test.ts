import { Application } from 'express';
import { validation } from '../../src/validation';
import { headers, initialize, makeClient, TestClient } from '../helpers';

let app: Application;
let client: TestClient;

beforeAll(async () => {
  app = await initialize();
  client = makeClient('/api/v1', headers.default, app);
});

const testOrg = {
  name: 'test-org',
};

it('can create an organization', async () => {
  const res = await client.post(testOrg, '/organizations');
  expect(res.status).toBe(201);
  expect(res.body).toStrictEqual({
    object: 'organization',
    id: expect.any(String),
    name: 'test-org',
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

it('cannot create an organization with the same name', async () => {
  await client.post(testOrg, '/organizations');
  const res = await client.post(testOrg, '/organizations', headers.otherUser());
  expect(res.status).toBe(400);
  expect(res.body.details).toBe('A organization with that name already exists.');
});

it('only accepts organization names that are longer than 2 and less than 256 characters', async () => {
  let res = await client.post({ name: '12' }, '/organizations');
  expect(res.status).toBe(400);

  let name = '';
  for (let i = 0; i < 256; i++) {
    name += '1';
  }
  res = await client.post({ name }, '/organizations');
  expect(res.status).toBe(400);
});

it('cannot create an organization if the user already belongs to one', async () => {
  let res = await client.post(testOrg, '/organizations');
  res = await client.post(
    { name: 'other-org' },
    '/organizations',
    headers.userWithOrg(res.body.id, 'test-id')
  );
  expect(res.status).toBe(400);
});

it('cannot create an organization with missing properties', async () => {
  const res = await client.post({}, '/organizations');
  expect(res.body.details).toContainEqual({
    object: 'error-detail',
    name: 'Validation Error',
    details: validation.required('name'),
  });
  expect(res.status).toBe(400);
});
