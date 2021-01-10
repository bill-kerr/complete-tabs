import express from 'express';
import { requireAuth } from '../../middleware';

const router = express.Router();
router.use(requireAuth);

router.post('/', async (_req, res) => {
  res.sendStatus(201);
});

export { router as tabItemRouter };
