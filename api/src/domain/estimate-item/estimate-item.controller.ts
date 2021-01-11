import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
import { EstimateItem } from './estimate-item.entity';
import {
  createEstimateItem,
  deleteEstimateItem,
  getEstimateItemById,
  getEstimateItems,
  updateEstimateItem,
} from './estimate-item.service';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const estimateItems = await getEstimateItems({ user: req.user });
  return res.status(200).sendRes(estimateItems);
});

router.get('/:id', async (req, res) => {
  const estimateItem = await getEstimateItemById(req.params.id, { user: req.user });
  return res.status(200).sendRes(estimateItem);
});

router.post('/', validateBody(EstimateItem, [Groups.CREATE]), async (req, res) => {
  const estimateItem = await createEstimateItem(
    { user: req.user, resource: req.body },
    req.body.contractItemId,
    req.body.estimateId
  );
  return res.status(201).sendRes(estimateItem);
});

router.put('/:id', validateBody(EstimateItem, [Groups.UPDATE]), async (req, res) => {
  const estimateItem = await updateEstimateItem(req.params.id, {
    user: req.user,
    resource: req.body,
  });
  return res.status(200).sendRes(estimateItem);
});

router.delete('/:id', async (req, res) => {
  await deleteEstimateItem(req.params.id, { user: req.user });
  return res.sendStatus(204);
});

export { router as estimateItemRouter };
