import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
import { ContractItem } from './contract-item.entity';
import { createContractItem, getContractItemById } from './contract-item.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', async (req, res) => {
  const contractItem = await getContractItemById(req.params.id, { user: req.user });
  res.sendRes(contractItem);
});

router.post('/', validateBody(ContractItem, [Groups.CREATE]), async (req, res) => {
  const contractItem = await createContractItem(
    { user: req.user, resource: req.body },
    req.body.projectId
  );
  return res.status(201).sendRes(contractItem);
});

export { router as contractItemRouter };
