import { createQueryBuilder } from 'typeorm';
import { NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { ContractItem } from '../contract-item/contract-item.entity';
import { getContractItemById } from '../contract-item/contract-item.service';
import { Estimate } from '../estimate/estimate.entity';
import { getEstimateById } from '../estimate/estimate.service';
import { Project } from '../project/project.entity';
import { EstimateItem } from './estimate-item.entity';

export async function getEstimateItemById(
  estimateItemId: string,
  context: ReadContext<EstimateItem>
) {
  const estimateItem = await getQuery(context, estimateItemId).getOne();
  if (!estimateItem) {
    throw new NotFoundError(`An estimate-item with an id of ${estimateItemId} does not exist.`);
  }
  return estimateItem;
}

export function getEstimateItems(context: ReadContext<EstimateItem>) {
  return getQuery(context).getMany();
}

export async function createEstimateItem(
  context: WriteContext<EstimateItem>,
  contractItemId: string,
  estimateId: string
) {
  const contractItem = await getContractItemById(contractItemId, { user: context.user });
  const estimate = await getEstimateById(estimateId, { user: context.user });
  return createEstimateItemByContractItemAndEstimate(context, contractItem, estimate);
}

export async function createEstimateItemByContractItemAndEstimate(
  context: WriteContext<EstimateItem>,
  contractItem: ContractItem,
  estimate: Estimate
) {
  const estimateItem = EstimateItem.create({ ...context.resource, contractItem, estimate });
  await estimateItem.persist();
  return estimateItem;
}

function getQuery(context: ReadContext<EstimateItem>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(EstimateItem, 'estimate_item')
    .innerJoin(ContractItem, 'contract_item', 'contract_item.id = estimate_item.contract_item_id')
    .innerJoin(Estimate, 'estimate', 'estimate.id = estimate_item.estimate_id')
    .innerJoin(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.organization_id = :id',
      { id: context.user.organizationId }
    )
    .where(filter);
}
