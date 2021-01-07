import express from 'express';
import { requireAuth, requireMembership } from '../../middleware';
import { validateBody } from '../../validation';
import { CREATE } from '../groups';
import { Project } from './project.entity';
import { createProject } from './project.service';

const router = express.Router();
router.use(requireAuth);

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
