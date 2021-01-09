import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, Unique, OneToMany } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { Organization } from '../organization/organization.entity';
import { ContractItem } from '../contract-item/contract-item.entity';

@Entity()
@Unique(['projectNumber', 'organization'])
@Exclude()
export class Project extends ApiObject {
  object = 'project';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('name') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('name') })
  @Length(3, 255, {
    groups: [Groups.CREATE],
    message: validation.length('name', 3, 255),
  })
  @Column({ nullable: false })
  name: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('projectNumber') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('projectNumber') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('projectNumber', 1, 255),
  })
  @Column({ nullable: false })
  projectNumber: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.CREATE, Groups.UPDATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('description') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('description', 1, 255),
  })
  @Column({ nullable: true })
  description: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.CREATE, Groups.UPDATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('client') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('client', 1, 255),
  })
  @Column({ nullable: true })
  client: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('active') })
  @IsBoolean({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.boolean('active') })
  @Column({ nullable: false })
  active: boolean;

  organizationId: string;

  @ManyToOne(() => Organization, org => org.projects, { onDelete: 'CASCADE', eager: true })
  organization: Organization;

  @OneToMany(() => ContractItem, contractItem => contractItem.project)
  contractItems: ContractItem[];
}
