import express from 'express';
import { createUser } from '../../firebase';
import { validateBody } from '../../validation';
import { Groups } from '../groups';
import { User } from './user.entity';

const authRouter = express.Router();

authRouter.post('/register', validateBody(User, [Groups.CREATE]), async (req, res) => {
  const user = await createUser(req.body.email, req.body.password);
  res.status(201).sendRes(user);
});

export { authRouter };
