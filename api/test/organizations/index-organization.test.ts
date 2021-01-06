import { Application } from 'express';
import { Organization } from '../../src/domain/organization/organization.entity';
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

const createOrg = async (org: Partial<Organization> = testOrg) => {
  const res = await client.post(org, '/organizations');
  return res.body as Organization;
};

it('can get an organization created by the user', async () => {
  const org = await createOrg();
  const res = await client.get(`/organizations/${org.id}`, headers.userWithOrg(org.id));
  expect(res.status).toBe(200);
  expect(res.body).toStrictEqual({
    object: 'organization',
    id: expect.any(String),
    name: testOrg.name,
  });
});

it('cannot get organizations created by other users', async () => {
  const org = await createOrg();
  const res = await client.get(`/organizations/${org.id}`, headers.userWithOrg('some-other-org'));
  expect(res.status).toBe(404);
});

it('returns a 404 when the id does not match', async () => {
  const org = await createOrg();
  const res = await client.get(`/organizations/does-not-exist`, headers.userWithOrg(org.id));
  expect(res.status).toBe(404);
});

it('cannot get organizations when the custom claim is incorrect', async () => {
  const org = await createOrg();
  const res = await client.get(`/organizations/${org.id}`, headers.userWithOrg('does-not-exist'));
  expect(res.status).toBe(404);
});
