import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
import { Estimate } from './estimate.entity';
import { createEstimate, getEstimateById } from './estimate.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', async (req, res) => {
  const estimate = await getEstimateById(req.params.id, { user: req.user });
  res.sendRes(estimate);
});

router.post('/', validateBody(Estimate, [Groups.CREATE]), async (req, res) => {
  const estimate = await createEstimate({ user: req.user, resource: req.body }, req.body.projectId);
  return res.status(201).sendRes(estimate);
});

export { router as estimateRouter };
