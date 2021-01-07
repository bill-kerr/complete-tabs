import express from 'express';
import { requireAuth, requireMembership, addProperty } from '../../middleware';
import { validateBody } from '../../validation';
import { CREATE } from '../groups';
import { Project } from '../project/project.entity';
import { createProject } from '../project/project.service';
import { Organization } from './organization.entity';
import { createOrganization, getOrganizationById } from './organization.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', requireMembership(), async (req, res) => {
  const org = await getOrganizationById(req.params.id, { user: req.user });
  return res.status(200).sendRes(org);
});

router.get('/', async (req, res) => {
  const org = await getOrganizationById(req.user.organizationId, { user: req.user });
  return res.status(200).sendRes(org);
});

router.post(
  '/',
  addProperty({ location: 'userId', key: 'userId' }),
  validateBody(Organization, CREATE),
  async (req, res) => {
    const org = await createOrganization({ user: req.user, resource: req.body });
    return res.status(201).sendRes(org);
  }
);

router.post(
  '/:id/projects',
  requireMembership(),
  addProperty({ key: 'id', location: 'params', destinationKey: 'organizationId' }),
  validateBody(Project, CREATE),
  async (req, res) => {
    const project = await createProject(
      { user: req.user, resource: req.body },
      req.user.organizationId
    );
    return res.status(201).sendRes(project);
  }
);

export { router as organizationRouter };
