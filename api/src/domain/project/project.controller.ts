import express from 'express';
import { addProperty, requireAuth, validateBody } from '../../middleware';
import { ContractItem } from '../contract-item/contract-item.entity';
import { createContractItem } from '../contract-item/contract-item.service';
import { Estimate } from '../estimate/estimate.entity';
import { createEstimate } from '../estimate/estimate.service';
import { Groups } from '../groups';
import { Project } from './project.entity';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from './project.service';

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

router.post('/', validateBody(Project, [Groups.CREATE]), async (req, res) => {
  const project = await createProject({ user: req.user, resource: req.body });
  return res.status(201).sendRes(project);
});

router.put('/:id', validateBody(Project, [Groups.UPDATE]), async (req, res) => {
  const project = await updateProject(req.params.id, { user: req.user, resource: req.body });
  res.status(200).sendRes(project);
});

router.delete('/:id', async (req, res) => {
  await deleteProject(req.params.id, { user: req.user });
  res.sendStatus(204);
});

router.post(
  '/:id/contract-items',
  addProperty({ key: 'id', location: 'params', destinationKey: 'projectId' }),
  validateBody(ContractItem, [Groups.CREATE]),
  async (req, res) => {
    const contractItem = await createContractItem(
      { user: req.user, resource: req.body },
      req.body.projectId
    );
    res.status(201).sendRes(contractItem);
  }
);

router.post(
  '/:id/estimates',
  addProperty({ key: 'id', location: 'params', destinationKey: 'projectId' }),
  validateBody(Estimate, [Groups.CREATE]),
  async (req, res) => {
    const estimate = await createEstimate(
      { user: req.user, resource: req.body },
      req.body.projectId
    );
    res.status(201).sendRes(estimate);
  }
);

export { router as projectRouter };
