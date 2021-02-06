import express from 'express';
import { requireAuth, requireMembership, validateBody } from '../../middleware';
import { handleQuery } from '../../middleware/handle-query';
import { Groups } from '../groups';
import { Project } from '../project/project.entity';
import { createProject, getProjects } from '../project/project.service';
import { Organization } from './organization.entity';
import { createOrganization, getOrganizationById, leaveOrganization } from './organization.service';

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

router.delete('/', async (req, res) => {
  await leaveOrganization({ user: req.user });
  return res.sendStatus(204);
});

router.post('/', validateBody(Organization, [Groups.CREATE]), async (req, res) => {
  const org = await createOrganization({ user: req.user, resource: req.body });
  return res.status(201).sendRes(org);
});

router.get('/:id/projects', handleQuery, async (req, res) => {
  const projects = await getProjects({
    user: req.user,
    baseUrl: req.baseUrl,
    limit: req.queryParams?.limit,
    page: req.queryParams?.page,
  });
  return res.status(200).sendRes(projects);
});

router.post(
  '/:id/projects',
  requireMembership(),
  validateBody(Project, [Groups.CREATE]),
  async (req, res) => {
    const project = await createProject({ user: req.user, resource: req.body });
    return res.status(201).sendRes(project);
  }
);

export { router as organizationRouter };
