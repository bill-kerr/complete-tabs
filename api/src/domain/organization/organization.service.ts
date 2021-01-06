import { uuid } from '../../utils';
import { NotFoundError } from '../../errors';
import { Organization } from './organization.entity';
import { ReadContext, WriteContext } from '../context';
import { createOrganizationClaim } from '../../firebase';

export async function createOrganization(context: WriteContext<Organization>) {
  const org = Organization.create(context.resource);
  org.id = uuid();
  await createOrganizationClaim(context.user, org.id);
  await org.persist();
  return org;
}

export async function getOrganizationById(id: string, context: ReadContext<Organization>) {
  const org = await Organization.findOne({ ...context.filter, id });
  if (!org) {
    throw new NotFoundError(`An organization with an id of ${id} does not exist.`);
  }
  return org;
}

export async function getOrganizations(context: ReadContext<Organization>) {
  const orgs = await Organization.find(context.filter);
  return orgs;
}
