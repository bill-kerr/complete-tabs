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
  const existing = await getQuery({ ...context, filter: { code: context.resource.code } }).getOne();
  if (existing) {
    throw new BadRequestError('A cost-code with that code already exists.');
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