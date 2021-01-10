import { createQueryBuilder } from 'typeorm';
import { NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { Project } from '../project/project.entity';
import { getProjectById } from '../project/project.service';
import { Estimate } from './estimate.entity';

export async function getEstimateById(id: string, context: ReadContext<Estimate>) {
  const estimate = await getQuery(context, id).getOne();
  if (!estimate) {
    throw new NotFoundError(`A contract-item with an id of ${id} does not exist.`);
  }
  return estimate;
}

export async function getEstimates(context: ReadContext<Estimate>) {
  const estimates = await getQuery(context).getMany();
  return estimates;
}

export async function createEstimate(context: WriteContext<Estimate>, projectId: string) {
  const project = await getProjectById(projectId, { user: context.user });
  return createEstimateByProject(context, project);
}

export async function createEstimateByProject(context: WriteContext<Estimate>, project: Project) {
  const estimate = Estimate.create({ ...context.resource, project });
  await estimate.persist();
  return estimate;
}

export async function updateEstimate(estimateId: string, context: WriteContext<Estimate>) {
  const estimate = await getEstimateById(estimateId, context);
  const updated = Estimate.merge(estimate, context.resource);
  await updated.persist();
  return updated;
}

export async function deleteEstimate(estimateId: string, context: ReadContext<Estimate>) {
  const estimate = await getEstimateById(estimateId, context);
  return estimate.delete();
}

function getQuery(context: ReadContext<Estimate>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(Estimate, 'estimate')
    .innerJoin(
      Project,
      'project',
      'project.id = estimate.project_id AND project.organization_id = :id',
      { id: context.user.organizationId }
    )
    .where(filter);
}
