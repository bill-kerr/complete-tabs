import { NotFoundError } from '../../errors';
import { calcPagination } from '../../utils';
import { ReadContext, ReadManyContext, WriteContext } from '../context';
import { Project } from './project.entity';

export async function getProjectById(id: string, context: ReadContext<Project>) {
  const project = await Project.findOne({
    where: { ...context.filter, id, userId: context.user.id },
  });
  if (!project) {
    throw new NotFoundError(`A project with an id of ${id} does not exist.`);
  }
  return project;
}

export async function getProjects(context: ReadManyContext<Project>) {
  const projects = await Project.find({
    where: { ...context.filter, userId: context.user.id },
    ...calcPagination(context),
  });
  return projects;
}

export async function createProject(context: WriteContext<Project>) {
  const project = Project.create({ ...context.resource, userId: context.user.id });
  await project.persist();
  return project;
}

export async function updateProject(projectId: string, context: WriteContext<Project>) {
  const project = await getProjectById(projectId, context);
  const updatedProject = Project.merge(project, context.resource);
  await updatedProject.persist();
  return updatedProject;
}

export async function deleteProject(projectId: string, context: ReadContext<Project>) {
  const project = await getProjectById(projectId, context);
  return project.delete();
}
