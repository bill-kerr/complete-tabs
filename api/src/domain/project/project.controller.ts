import express from 'express';
import { requireAuth, requireMembership } from '../../middleware';
import { validateBody } from '../../validation';
import { CREATE } from '../groups';
import { Project } from './project.entity';
import { createProject, getProjectById } from './project.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', async (req, res) => {
  const project = await getProjectById(req.params.id, { user: req.user });
  return res.status(200).sendRes(project);
});

router.post(
  '/',
  validateBody(Project, CREATE),
  requireMembership('organizationId', 'body'),
  async (req, res) => {
    const project = await createProject(
      { user: req.user, resource: req.body },
      req.body.organizationId
    );
    return res.status(201).sendRes(project);
  }
);

export { router as projectRouter };
