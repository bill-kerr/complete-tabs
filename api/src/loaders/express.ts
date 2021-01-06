import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';
import { methodChecker, responseWrapper, verifyJson } from '../middleware';
import { errorHandler, NotFoundError } from '../errors';
import { authRouter } from '../domain/auth/auth.controller';
import { organizationRouter } from '../domain/organization/organization.controller';
import { projectRouter } from '../domain/project/project.controller';

export function initExpressApp() {
  const app = express();
  app.use(responseWrapper);
  app.use(methodChecker);
  app.use(verifyJson);
  app.use(helmet());
  app.use(cors());
  app.use(json());

  const v1 = express.Router();
  v1.use('/auth', authRouter);
  v1.use('/organizations', organizationRouter);
  v1.use('/projects', projectRouter);

  app.use('/api/v1', v1);

  app.all('*', () => {
    throw new NotFoundError('This endpoint does not exist.');
  });

  app.use(errorHandler);

  return app;
}
