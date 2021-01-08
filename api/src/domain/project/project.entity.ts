import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { ALL, CREATE, CREATE_UPDATE, UPDATE } from '../groups';
import { Organization } from '../organization/organization.entity';

@Entity()
@Unique(['projectNumber', 'organization'])
@Exclude()
export class Project extends ApiObject {
  object = 'project';

  @Expose({ groups: ALL })
  @IsOptional({ groups: UPDATE })
  @IsNotEmpty({ groups: CREATE, message: validation.required('name') })
  @IsString({ groups: CREATE_UPDATE, message: validation.string('name') })
  @Length(3, 255, {
    groups: CREATE,
    message: validation.length('name', 3, 255),
  })
  @Column({ nullable: false })
  name: string;

  @Expose({ groups: ALL })
  @IsOptional({ groups: UPDATE })
  @IsNotEmpty({ groups: CREATE, message: validation.required('projectNumber') })
  @IsString({ groups: CREATE_UPDATE, message: validation.string('projectNumber') })
  @Length(1, 255, {
    groups: CREATE,
    message: validation.length('projectNumber', 1, 255),
  })
  @Column({ nullable: false })
  projectNumber: string;

  @Expose({ groups: ALL })
  @IsOptional({ groups: CREATE_UPDATE })
  @IsString({ groups: CREATE_UPDATE, message: validation.string('description') })
  @Length(1, 255, {
    groups: CREATE,
    message: validation.length('description', 1, 255),
  })
  @Column({ nullable: true })
  description: string;

  @Expose({ groups: ALL })
  @IsOptional({ groups: CREATE_UPDATE })
  @IsString({ groups: CREATE_UPDATE, message: validation.string('client') })
  @Length(1, 255, {
    groups: CREATE,
    message: validation.length('client', 1, 255),
  })
  @Column({ nullable: true })
  client: string;

  @Expose({ groups: ALL })
  @IsOptional({ groups: UPDATE })
  @IsNotEmpty({ groups: CREATE, message: validation.required('active') })
  @IsBoolean({ groups: CREATE_UPDATE, message: validation.boolean('active') })
  @Column({ nullable: false })
  active: boolean;

  organizationId: string;

  @ManyToOne(() => Organization, org => org.projects, { onDelete: 'CASCADE', eager: true })
  organization: Organization;
}
