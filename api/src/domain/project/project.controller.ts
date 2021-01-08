import express from 'express';
import { requireAuth } from '../../middleware';
import { validateBody } from '../../validation';
import { CREATE, UPDATE } from '../groups';
import { Project } from './project.entity';
import { createProject, getProjectById, getProjects, updateProject } from './project.service';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', async (req, res) => {
  const project = await getProjectById(req.params.id, { user: req.user });
  return res.status(200).sendRes(project);
});

router.get('/', async (req, res) => {
  const projects = await getProjects({
    user: req.user,
  });
  return res.status(200).sendRes(projects);
});

router.post('/', validateBody(Project, CREATE), async (req, res) => {
  const project = await createProject({ user: req.user, resource: req.body });
  return res.status(201).sendRes(project);
});

router.put('/:id', validateBody(Project, UPDATE), async (req, res) => {
  const project = await updateProject(req.params.id, { user: req.user, resource: req.body });
  res.status(200).sendRes(project);
});

export { router as projectRouter };
