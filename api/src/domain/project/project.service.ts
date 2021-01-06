import { WriteContext } from '../context';
import { Organization } from '../organization/organization.entity';
import { getOrganizationById } from '../organization/organization.service';
import { Project } from './project.entity';

export async function createProjectByOrganization(
  context: WriteContext<Project>,
  organization: Organization
) {
  console.log('org', organization);
  const project = Project.create({ ...context.resource, organization });
  await project.persist();
  return project;
}

export async function createProject(context: WriteContext<Project>, organizationId: string) {
  const org = await getOrganizationById(organizationId, { user: context.user });
  const project = await createProjectByOrganization(context, org);
  return project;
}
