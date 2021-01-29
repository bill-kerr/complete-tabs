import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
import { CostCode } from './cost-code.entity';
import { createCostCode, getCostCodeById, getCostCodes, updateCostCode } from './cost-code.service';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const costCodes = await getCostCodes({ user: req.user });
  return res.status(200).sendRes(costCodes);
});

router.get('/:id', async (req, res) => {
  const costCode = await getCostCodeById(req.params.id, { user: req.user });
  return res.status(200).sendRes(costCode);
});

router.post('/', validateBody(CostCode, [Groups.CREATE]), async (req, res) => {
  const costCode = await createCostCode(
    { user: req.user, resource: req.body },
    req.body.contractItemId
  );
  return res.status(201).sendRes(costCode);
});

router.put('/:id', validateBody(CostCode, [Groups.UPDATE]), async (req, res) => {
  const costCode = await updateCostCode(req.params.id, { user: req.user, resource: req.body });
  res.status(200).sendRes(costCode);
});

export { router as costCodeRouter };
