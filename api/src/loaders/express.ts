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
import { contractItemRouter } from '../domain/contract-item/contract-item.controller';
import { estimateRouter } from '../domain/estimate/estimate.controller';
import { tabItemRouter } from '../domain/tab-item/tab-item.controller';
import { estimateItemRouter } from '../domain/estimate-item/estimate-item.controller';
import { costCodeRouter } from '../domain/cost-code/cost-code.controller';

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
  v1.use('/contract-items', contractItemRouter);
  v1.use('/tab-items', tabItemRouter);
  v1.use('/estimates', estimateRouter);
  v1.use('/estimate-items', estimateItemRouter);
  v1.use('/cost-codes', costCodeRouter);
  app.use('/api/v1', v1);

  app.all('*', () => {
    throw new NotFoundError('This endpoint does not exist.');
  });

  app.use(errorHandler);

  return app;
}
