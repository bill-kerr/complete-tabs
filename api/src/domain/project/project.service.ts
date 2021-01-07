import { NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { Organization } from '../organization/organization.entity';
import { getOrganizationById } from '../organization/organization.service';
import { Project } from './project.entity';

export async function getProjectById(id: string, context: ReadContext<Project>) {
  const project = await Project.findOne({ ...context.filter, id });
  if (!project || project.organization.id !== context.user.organizationId) {
    throw new NotFoundError(`A project with an id of ${id} does not exist.`);
  }
  return project;
}

export async function createProjectByOrganization(
  context: WriteContext<Project>,
  organization: Organization
) {
  const project = Project.create({ ...context.resource, organization });
  await project.persist();
  return project;
}

export async function createProject(context: WriteContext<Project>, organizationId: string) {
  const org = await getOrganizationById(organizationId, { user: context.user });
  const project = await createProjectByOrganization(context, org);
  return project;
}
