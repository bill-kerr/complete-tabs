import dotenv from 'dotenv';
dotenv.config({ path: './test/test.env' });
import { getConnection } from 'typeorm';
import { Organization } from '../src/domain/organization/organization.entity';
import { Project } from '../src/domain/project/project.entity';

afterEach(async () => {
  await Organization.remove(await Organization.find());
  await Project.remove(await Project.find());
});

afterAll(async () => {
  getConnection().close();
});
