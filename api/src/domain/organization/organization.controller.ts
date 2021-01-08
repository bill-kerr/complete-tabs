import express from 'express';
import { requireAuth, requireMembership } from '../../middleware';
import { validateBody } from '../../validation';
import { CREATE } from '../groups';
import { Project } from '../project/project.entity';
import { createProject, getProjects } from '../project/project.service';
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

router.post('/', validateBody(Organization, CREATE), async (req, res) => {
  const org = await createOrganization({ user: req.user, resource: req.body });
  return res.status(201).sendRes(org);
});

router.get('/:id/projects', async (req, res) => {
  const projects = await getProjects({ user: req.user });
  return res.status(200).sendRes(projects);
});

router.post(
  '/:id/projects',
  requireMembership(),
  validateBody(Project, CREATE),
  async (req, res) => {
    const project = await createProject({ user: req.user, resource: req.body });
    return res.status(201).sendRes(project);
  }
);

export { router as organizationRouter };
