import express from 'express';
import { requireAuth } from '../../middleware';
import { validateBody } from '../../validation';
import { Groups } from '../groups';
import { ContractItem } from './contract-item.entity';
import { createContractItem } from './contract-item.service';

const router = express.Router();
router.use(requireAuth);

router.post('/', validateBody(ContractItem, [Groups.CREATE]), async (req, res) => {
  const contractItem = await createContractItem(
    { user: req.user, resource: req.body },
    req.body.projectId
  );
  return res.status(201).sendRes(contractItem);
});

export { router as contractItemRouter };
