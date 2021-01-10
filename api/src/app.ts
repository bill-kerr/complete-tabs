const env = getEnv();
import dotenv from 'dotenv';
dotenv.config({ path: getEnvFile(env) });
import { config } from './config';
import { connectDatabase } from './loaders/database';
import { initFirebase } from './firebase';
import { initExpressApp } from './loaders/express';
import { Organization } from './domain/organization/organization.entity';
import { Project } from './domain/project/project.entity';
import { ContractItem } from './domain/contract-item/contract-item.entity';
import { Estimate } from './domain/estimate/estimate.entity';

async function startApp() {
  const app = initExpressApp();

  try {
    await connectDatabase(Organization, Project, ContractItem, Estimate);
    console.log('API server connected to database.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  initFirebase();

  app.listen(config.PORT, () =>
    console.log(`API server running in ${env} mode and listening on port ${config.PORT}.`)
  );
}

function getEnvFile(env: string) {
  if (env === 'test') {
    return './test.env';
  } else if (env === 'development') {
    return './dev.env';
  } else {
    return './.env';
  }
}

function getEnv() {
  return process.env.NODE_ENV?.toLowerCase() || 'development';
}

startApp();
