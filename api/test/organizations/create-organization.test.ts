import { Application } from 'express';
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
  });
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
