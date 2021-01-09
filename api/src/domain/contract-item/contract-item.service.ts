import { createQueryBuilder } from 'typeorm';
import { NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { Project } from '../project/project.entity';
import { getProjectById } from '../project/project.service';
import { ContractItem } from './contract-item.entity';

export async function createContractItem(context: WriteContext<ContractItem>, projectId: string) {
  const project = await getProjectById(projectId, { user: context.user });
  return createContractItemByProject(context, project);
}

export async function createContractItemByProject(
  context: WriteContext<ContractItem>,
  project: Project
) {
  const contractItem = ContractItem.create({ ...context.resource, project });
  await contractItem.persist();
  return contractItem;
}

export async function getContractItemById(id: string, context: ReadContext<ContractItem>) {
  const contractItem = await createQueryBuilder(ContractItem, 'contract_item')
    .innerJoinAndSelect(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.organization_id = :id',
      { id: context.user.organizationId }
    )
    .where({ ...context.filter, id })
    .getOne();
  if (!contractItem) {
    throw new NotFoundError(`A contract-item with an id of ${id} does not exist.`);
  }
  return contractItem;
}
