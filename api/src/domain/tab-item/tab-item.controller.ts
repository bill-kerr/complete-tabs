import express from 'express';
import { requireAuth, validateBody } from '../../middleware';
import { Groups } from '../groups';
import { TabItem } from './tab-item.entity';
import {
  createTabItem,
  deleteTabItem,
  getTabItemById,
  getTabItems,
  updateTabItem,
} from './tab-item.service';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const tabItems = await getTabItems({ user: req.user });
  return res.status(200).sendRes(tabItems);
});

router.get('/:id', async (req, res) => {
  const tabItem = await getTabItemById(req.params.id, { user: req.user });
  return res.status(200).sendRes(tabItem);
});

router.post('/', validateBody(TabItem, [Groups.CREATE]), async (req, res) => {
  const tabItem = await createTabItem(
    { user: req.user, resource: req.body },
    req.body.contractItemId
  );
  return res.status(201).sendRes(tabItem);
});

router.put('/:id', validateBody(TabItem, [Groups.UPDATE]), async (req, res) => {
  const tabItem = await updateTabItem(req.params.id, { user: req.user, resource: req.body });
  return res.status(200).sendRes(tabItem);
});

router.delete('/:id', async (req, res) => {
  await deleteTabItem(req.params.id, { user: req.user });
  return res.sendStatus(204);
});

export { router as tabItemRouter };
