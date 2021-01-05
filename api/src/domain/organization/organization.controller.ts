import express from 'express';
import { requireAuth } from '../../middleware';
import { requireMembership } from '../../middleware/require-membership';
import { validateBody } from '../../validation';
import { CREATE } from '../groups';
import { Organization } from './organization.entity';
import { createOrganization, getOrganizationById } from './organization.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', requireMembership, async (req, res) => {
  const org = await getOrganizationById(req.params.id, { user: req.user });
  return res.status(200).sendRes(org);
});

router.post('/', validateBody(Organization, CREATE, true), async (req, res) => {
  const org = await createOrganization({ user: req.user, resource: req.body });
  return res.status(201).sendRes(org);
});

export { router as organizationRouter };
