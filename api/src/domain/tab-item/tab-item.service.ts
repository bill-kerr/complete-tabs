import { createQueryBuilder } from 'typeorm';
import { NotFoundError } from '../../errors';
import { ReadContext, WriteContext } from '../context';
import { ContractItem } from '../contract-item/contract-item.entity';
import { getContractItemById } from '../contract-item/contract-item.service';
import { Project } from '../project/project.entity';
import { TabItem } from './tab-item.entity';

export async function getTabItemById(tabItemId: string, context: ReadContext<TabItem>) {
  const tabItem = await getQuery(context, tabItemId).getOne();
  if (!tabItem) {
    throw new NotFoundError(`A tab-item with an id of ${tabItemId} does not exist.`);
  }
  return tabItem;
}

export function getTabItems(context: ReadContext<TabItem>) {
  return getQuery(context).getMany();
}

export async function createTabItem(context: WriteContext<TabItem>, contractItemId: string) {
  const contractItem = await getContractItemById(contractItemId, { user: context.user });
  return createTabItemByContractItem(context, contractItem);
}

export async function createTabItemByContractItem(
  context: WriteContext<TabItem>,
  contractItem: ContractItem
) {
  const tabItem = TabItem.create({ ...context.resource, contractItem });
  await tabItem.persist();
  return tabItem;
}

export async function updateTabItem(tabItemId: string, context: WriteContext<TabItem>) {
  const tabItem = await getTabItemById(tabItemId, context);
  const updated = TabItem.merge(tabItem, context.resource);
  await updated.persist();
  return updated;
}

export async function deleteTabItem(tabItemId: string, context: ReadContext<TabItem>) {
  const tabItem = await getTabItemById(tabItemId, context);
  return tabItem.delete();
}

function getQuery(context: ReadContext<TabItem>, id?: string) {
  const filter = id ? { ...context.filter, id } : { ...context.filter };
  return createQueryBuilder(TabItem, 'tab_item')
    .innerJoin(ContractItem, 'contract_item', 'contract_item.id = tab_item.contract_item_id', {
      id: context.user.organizationId,
    })
    .innerJoin(
      Project,
      'project',
      'project.id = contract_item.project_id AND project.organization_id = :id',
      { id: context.user.organizationId }
    )
    .where(filter);
}
