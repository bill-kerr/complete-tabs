import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { ContractItem } from '../contract-item/contract-item.entity';

@Entity()
@Exclude()
export class TabItem extends ApiObject {
  object = 'tab-item';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('tabSet') })
  @Length(1, 255, {
    groups: [Groups.CREATE],
    message: validation.length('tabSet', 1, 255),
  })
  @Column({ nullable: true })
  tabSet: string;

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
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('remarks') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('remarks', 1, 255),
  })
  @Column({ nullable: true })
  remarks: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('street') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('street', 1, 255),
  })
  @Column({ nullable: true })
  street: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('side') })
  @Length(1, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('side', 1, 255),
  })
  @Column({ nullable: true })
  side: string;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsInt({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.integer('beginStation') })
  @Column({ nullable: true, type: 'int' })
  beginStation: number;

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE, Groups.CREATE] })
  @IsInt({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.integer('endStation') })
  @Column({ nullable: true, type: 'int' })
  endStation: number;

  @Expose({ groups: [Groups.CREATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('contractItemId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('contractItemId') })
  contractItemId: string;

  @Expose({ groups: [Groups.READ] })
  @RelationId('contractItem')
  @ManyToOne(() => ContractItem, contractItem => contractItem.tabItems, { onDelete: 'CASCADE' })
  contractItem: ContractItem;
}
