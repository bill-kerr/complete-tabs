import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { ContractItem } from '../contract-item/contract-item.entity';

@Entity()
@Exclude()
export class CostCode extends ApiObject {
  object = 'cost-code';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('code') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('code') })
  @Length(1, 255, {
    groups: [Groups.CREATE],
    message: validation.length('code', 1, 255),
  })
  @Column({ nullable: false })
  code: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('description') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('description') })
  @Length(1, 255, {
    groups: [Groups.CREATE],
    message: validation.length('description', 1, 255),
  })
  @Column({ nullable: false })
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
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('unit') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('unit', 1, 255),
  })
  @Column({ nullable: false })
  unit: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { groups: [Groups.CREATE, Groups.UPDATE], message: validation.number('laborHours') }
  )
  @Column({ nullable: true, type: 'float' })
  laborHours: number;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { groups: [Groups.CREATE, Groups.UPDATE], message: validation.number('equipmentHours') }
  )
  @Column({ nullable: true, type: 'float' })
  equipmentHours: number;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsInt({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.integer('laborBudget') })
  @Column({ nullable: true, type: 'int' })
  laborBudget: number;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsInt({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.integer('equipmentBudget') })
  @Column({ nullable: true, type: 'int' })
  equipmentBudget: number;

  @Expose({ groups: [Groups.CREATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('contractItemId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('contractItemId') })
  contractItemId: string;

  @Expose({ groups: [Groups.READ] })
  @RelationId('contractItem')
  @ManyToOne(() => ContractItem, contractItem => contractItem.costCodes, { onDelete: 'CASCADE' })
  contractItem: ContractItem;
}
