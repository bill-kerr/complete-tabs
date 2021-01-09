import { WriteContext } from '../context';
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
