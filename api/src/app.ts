import dotenv from 'dotenv';
dotenv.config({ path: './dev.env' });
import { config } from './config';
import { connectDatabase } from './loaders/database';
import { initFirebase } from './firebase';
import { initExpressApp } from './loaders/express';

async function startApp() {
  const app = initExpressApp();

  try {
    await connectDatabase();
    console.log('API server connected to database.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  initFirebase();

  app.listen(config.PORT, () => console.log(`API server listening on port ${config.PORT}.`));
}

startApp();
