import express from 'express';
import { addProperty, requireAuth, validateBody } from '../../middleware';
import { EstimateItem } from '../estimate-item/estimate-item.entity';
import { createEstimateItem, getEstimateItems } from '../estimate-item/estimate-item.service';
import { Groups } from '../groups';
import { TabItem } from '../tab-item/tab-item.entity';
import { createTabItem, getTabItems } from '../tab-item/tab-item.service';
import { ContractItem } from './contract-item.entity';
import {
  createContractItem,
  deleteContractItem,
  getContractItemById,
  getContractItems,
  updateContractItem,
} from './contract-item.service';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const items = await getContractItems({ user: req.user });
  return res.status(200).sendRes(items);
});

router.get('/:id', async (req, res) => {
  const contractItem = await getContractItemById(req.params.id, { user: req.user });
  return res.sendRes(contractItem);
});

router.post('/', validateBody(ContractItem, [Groups.CREATE]), async (req, res) => {
  const contractItem = await createContractItem(
    { user: req.user, resource: req.body },
    req.body.projectId
  );
  return res.status(201).sendRes(contractItem);
});

router.put('/:id', validateBody(ContractItem, [Groups.UPDATE]), async (req, res) => {
  const contractItem = await updateContractItem(req.params.id, {
    user: req.user,
    resource: req.body,
  });
  return res.status(200).sendRes(contractItem);
});

router.delete('/:id', async (req, res) => {
  await deleteContractItem(req.params.id, { user: req.user });
  return res.sendStatus(204);
});

router.post(
  '/:id/tab-items',
  addProperty({ key: 'id', location: 'params', destinationKey: 'contractItemId' }),
  validateBody(TabItem, [Groups.CREATE]),
  async (req, res) => {
    const tabItem = await createTabItem({ user: req.user, resource: req.body }, req.params.id);
    return res.status(201).sendRes(tabItem);
  }
);

router.get('/:id/tab-items', async (req, res) => {
  const tabItems = await getTabItems({
    user: req.user,
    filter: { contractItem: { id: req.params.id } },
  });
  return res.status(200).sendRes(tabItems);
});

router.post(
  '/:id/estimate-items',
  addProperty({ key: 'id', location: 'params', destinationKey: 'contractItemId' }),
  validateBody(EstimateItem, [Groups.CREATE]),
  async (req, res) => {
    const estimateItem = await createEstimateItem(
      { user: req.user, resource: req.body },
      req.body.contractItemId,
      req.body.estimateId
    );
    return res.status(201).sendRes(estimateItem);
  }
);

router.get('/:id/estimate-items', async (req, res) => {
  const estimateItems = await getEstimateItems({
    user: req.user,
    filter: { contractItem: { id: req.params.id } },
  });
  return res.status(200).sendRes(estimateItems);
});

export { router as contractItemRouter };
