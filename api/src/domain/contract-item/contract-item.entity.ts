import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { Project } from '../project/project.entity';

@Entity()
@Unique(['itemNumber', 'project'])
@Exclude()
export class ContractItem extends ApiObject {
  object = 'contract-item';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('itemNumber') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('itemNumber') })
  @Length(1, 255, {
    groups: [Groups.CREATE],
    message: validation.length('itemNumber', 1, 255),
  })
  @Column({ nullable: false })
  itemNumber: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('description') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('description', 1, 255),
  })
  @Column({ nullable: true })
  description: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('quantity') })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { groups: [Groups.CREATE, Groups.UPDATE], message: validation.number('quantity') }
  )
  @Column({ nullable: false, type: 'float' })
  quantity: number;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('unit') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('unit') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('unit', 1, 255),
  })
  @Column({ nullable: true })
  unit: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('unitPrice') })
  @IsInt({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.integer('unitPrice') })
  @Column({ nullable: false, type: 'int' })
  unitPrice: number;

  @Expose({ groups: [Groups.CREATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('projectId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('projectId') })
  projectId: string;

  @ManyToOne(() => Project, project => project.contractItems, { onDelete: 'CASCADE', eager: true })
  project: Project;
}
