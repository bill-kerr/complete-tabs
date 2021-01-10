import dotenv from 'dotenv';
dotenv.config({ path: './test/test.env' });
import { getConnection } from 'typeorm';
import { ContractItem } from '../src/domain/contract-item/contract-item.entity';
import { Estimate } from '../src/domain/estimate/estimate.entity';
import { Organization } from '../src/domain/organization/organization.entity';
import { Project } from '../src/domain/project/project.entity';
import { TabItem } from '../src/domain/tab-item/tab-item.entity';

afterEach(async () => {
  await Organization.remove(await Organization.find());
  await Project.remove(await Project.find());
  await ContractItem.remove(await ContractItem.find());
  await Estimate.remove(await Estimate.find());
  await TabItem.remove(await TabItem.find());
});

afterAll(async () => {
  getConnection().close();
});
