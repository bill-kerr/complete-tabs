import { WriteContext } from '../context';
import { ContractItem } from '../contract-item/contract-item.entity';
import { getContractItemById } from '../contract-item/contract-item.service';
import { TabItem } from './tab-item.entity';

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
