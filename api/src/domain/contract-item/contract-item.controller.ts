import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
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
  res.status(200).sendRes(items);
});

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

export { router as contractItemRouter };
