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

export async function createCostCode(context: WriteContext<CostCode>, contractItemId: string) {
  const contractItem = await getContractItemById(contractItemId, { user: context.user });
  return createCostCodeByContractItem(context, contractItem);
}

export async function createCostCodeByContractItem(
  context: WriteContext<CostCode>,
  contractItem: ContractItem
) {
  const hasDuplicate = await projectHasCode(context.resource);
  if (hasDuplicate) {
    throw new BadRequestError('The project already has a cost code with the same code.');
  }
  const costCode = CostCode.create({ ...context.resource, contractItem });
  await costCode.persist();
  return costCode;
}

function getQuery(context: ReadContext<CostCode>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(CostCode, 'cost_code')
    .innerJoin(ContractItem, 'contract_item', 'contract_item.id = cost_code.contract_item_id')
    .innerJoin(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.organization_id = :id',
      { id: context.user.organizationId }
    )
    .where(filter);
}

async function projectHasCode(costCode: Partial<CostCode>) {
  // get the contract item
  const projectQuery = createQueryBuilder(ContractItem, 'contract_item')
    .select('contract_item.project_id', 'projectId')
    .where('contract_item.id = :id', { id: costCode.contractItemId });

  const count = await createQueryBuilder(CostCode, 'cost_code')
    .innerJoin(ContractItem, 'contract_item', 'cost_code.contract_item_id = :contractItemId', {
      contractItemId: costCode.contractItemId,
    })
    .where('cost_code.code = :code', { code: costCode.code })
    .andWhere(`contract_item.project_id IN (${projectQuery.getSql()})`)
    .getCount();

  return count > 0;
}

// async function hasDuplicate(context: WriteContext<CostCode>) {
//   const project = await createQueryBuilder(Project, 'project')
//     .innerJoin(ContractItem, 'contract_item', 'contract_item.project_id = project.id')
//     .getOne();

//   if (!project) {
//     return false;
//   }

//   const count = createQueryBuilder(CostCode, 'cost_code')
//     .where('cost_code.code = :code', { code: context.resource.code })
//     .innerJoin(ContractItem, 'contract_item', '')
// }
