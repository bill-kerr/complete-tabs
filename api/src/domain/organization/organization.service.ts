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

export async function updateOrganizationById(id: string, context: WriteContext<Organization>) {
  const org = await getOrganizationById(id, context);
  const updatedOrg = Organization.merge(org, context.resource);
  await updatedOrg.persist();
  return updatedOrg;
}

export async function deleteOrganization(organization: Organization) {
  await organization.delete();
}

export async function deleteOrganizationById(id: string, context: ReadContext<Organization>) {
  const org = await getOrganizationById(id, context);
  return deleteOrganization(org);
}
