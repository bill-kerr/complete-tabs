import express from 'express';
import { addProperty, requireAuth, validateBody } from '../../middleware';
import { EstimateItem } from '../estimate-item/estimate-item.entity';
import { createEstimateItem, getEstimateItems } from '../estimate-item/estimate-item.service';
import { Groups } from '../groups';
import { Estimate } from './estimate.entity';
import {
  createEstimate,
  deleteEstimate,
  getEstimateById,
  getEstimates,
  updateEstimate,
} from './estimate.service';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const estimates = await getEstimates({ user: req.user });
  return res.status(200).sendRes(estimates);
});

router.get('/:id', async (req, res) => {
  const estimate = await getEstimateById(req.params.id, { user: req.user });
  return res.status(200).sendRes(estimate);
});

router.post('/', validateBody(Estimate, [Groups.CREATE]), async (req, res) => {
  const estimate = await createEstimate({ user: req.user, resource: req.body }, req.body.projectId);
  return res.status(201).sendRes(estimate);
});

router.put('/:id', validateBody(Estimate, [Groups.UPDATE]), async (req, res) => {
  const estimate = await updateEstimate(req.params.id, { user: req.user, resource: req.body });
  return res.status(200).sendRes(estimate);
});

router.delete('/:id', async (req, res) => {
  await deleteEstimate(req.params.id, { user: req.user });
  return res.sendStatus(204);
});

router.post(
  '/:id/estimate-items',
  addProperty({ key: 'id', location: 'params', destinationKey: 'estimateId' }),
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
    filter: { estimate: { id: req.params.id } },
  });
  return res.status(200).sendRes(estimateItems);
});

export { router as estimateRouter };
