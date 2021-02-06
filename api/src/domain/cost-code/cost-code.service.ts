import { createQueryBuilder } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { ContractItem } from '../contract-item/contract-item.entity';
import { getContractItemById } from '../contract-item/contract-item.service';
import { Project } from '../project/project.entity';
import { CostCode } from './cost-code.entity';

export async function getCostCodeById(costCodeId: string, context: ReadContext<CostCode>) {
  const costCode = await getQuery(context, costCodeId).getOne();
  if (!costCode) {
    throw new NotFoundError(`A tab-item with an id of ${costCodeId} does not exist.`);
  }

  return costCode;
}

export function getCostCodes(context: ReadContext<CostCode>) {
  return getQuery(context).getMany();
}

export async function getCostCodesByProjectId(projectId: string, context: ReadContext<CostCode>) {
  const contractItemQuery = createQueryBuilder(ContractItem, 'contract_item')
    .select('contract_item.id', 'contract_item_id')
    .innerJoin(Project, 'project', 'project.user_id = :userId')
    .where('contract_item.project_id = :projectId');

  const costCodes = await createQueryBuilder(CostCode, 'cost_code')
    .where(`cost_code.contract_item_id IN (${contractItemQuery.getQuery()})`)
    .setParameters({
      userId: context.user.id,
      projectId,
    })
    .getMany();
  return costCodes;
}

export async function createCostCode(context: WriteContext<CostCode>, contractItemId: string) {
  const contractItem = await getContractItemById(contractItemId, { user: context.user });
  return createCostCodeByContractItem(context, contractItem);
}

export async function createCostCodeByContractItem(
  context: WriteContext<CostCode>,
  contractItem: ContractItem
) {
  const existingCode = await projectHasCode(context.resource.contractItemId, context.resource.code);
  if (existingCode) {
    throw new BadRequestError('The project already has a cost code with the same code.');
  }
  const costCode = CostCode.create({ ...context.resource, contractItem });
  await costCode.persist();
  return costCode;
}

export async function updateCostCode(costCodeId: string, context: WriteContext<CostCode>) {
  const costCode = await getCostCodeById(costCodeId, context);
  if (context.resource.code) {
    const existingCode = await projectHasCode(costCode.contractItemId, context.resource.code);
    if (existingCode && costCode.id !== existingCode.id) {
      throw new BadRequestError('The project already has a cost code with the same code.');
    }
  }

  const updated = CostCode.merge(costCode, context.resource);
  await updated.persist();
  return updated;
}

export async function deleteCostCode(costCodeId: string, context: ReadContext<CostCode>) {
  const costCode = await getCostCodeById(costCodeId, context);
  return costCode.delete();
}

function getQuery(context: ReadContext<CostCode>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(CostCode, 'cost_code')
    .innerJoin(ContractItem, 'contract_item', 'contract_item.id = cost_code.contract_item_id')
    .innerJoin(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.user_id = :id',
      { id: context.user.id }
    )
    .where(filter);
}

async function projectHasCode(contractItemId?: string, code?: string) {
  const projectQuery = createQueryBuilder(ContractItem, 'contract_item')
    .select('contract_item.project_id', 'projectId')
    .where('contract_item.id = :id', { id: contractItemId });

  const costCode = await createQueryBuilder(CostCode, 'cost_code')
    .innerJoin(ContractItem, 'contract_item', 'cost_code.contract_item_id = :contractItemId', {
      contractItemId,
    })
    .where('cost_code.code = :code', { code })
    .andWhere(`contract_item.project_id IN (${projectQuery.getSql()})`)
    .getOne();

  return costCode;
}
