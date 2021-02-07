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
  const contractItem = await getQuery(context, id).getOne();
  if (!contractItem) {
    throw new NotFoundError(`A contract-item with an id of ${id} does not exist.`);
  }
  return contractItem;
}

export function getContractItems(context: ReadContext<ContractItem>) {
  return getQuery(context).getMany();
}

export async function updateContractItem(
  contractItemId: string,
  context: WriteContext<ContractItem>
) {
  const contractItem = await getContractItemById(contractItemId, context);
  const updated = ContractItem.merge(contractItem, context.resource);
  await updated.persist();
  return updated;
}

export async function deleteContractItem(id: string, context: ReadContext<ContractItem>) {
  const contractItem = await getContractItemById(id, context);
  return contractItem.delete();
}

function getQuery(context: ReadContext<ContractItem>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(ContractItem, 'contract_item')
    .innerJoin(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.user_id = :id',
      { id: context.user.id }
    )
    .where(filter);
}
