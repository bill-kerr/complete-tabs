import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, IsNotEmpty, Validate } from 'class-validator';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { ApiObject } from '../api-object';
import { IsDate, validation } from '../../validation';
import { Groups } from '../groups';
import { Project } from '../project/project.entity';

@Entity()
@Unique(['estimateNumber', 'project'])
@Exclude()
export class Estimate extends ApiObject {
  object = 'estimate';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('estimateNumber') })
  @IsString({
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.string('estimateNumber'),
  })
  @Length(1, 255, {
    groups: [Groups.CREATE],
    message: validation.length('estimateNumber', 1, 255),
  })
  @Column({ nullable: false })
  estimateNumber: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('periodEnding') })
  @Validate(IsDate, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.date('periodEnding'),
  })
  @Column({ type: 'date', nullable: false })
  periodEnding: Date;

  @Expose({ groups: [Groups.CREATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('projectId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('projectId') })
  projectId: string;

  @ManyToOne(() => Project, project => project.contractItems, { onDelete: 'CASCADE', eager: true })
  project: Project;
}
