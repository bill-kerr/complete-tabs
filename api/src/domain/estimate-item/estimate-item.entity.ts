import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiObject } from '../api-object';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { ContractItem } from '../contract-item/contract-item.entity';
import { Estimate } from '../estimate/estimate.entity';

@Entity()
@Exclude()
export class EstimateItem extends ApiObject {
  object = 'estimate-item';

  @Expose({ groups: Groups.all() })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('quantity') })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { groups: [Groups.CREATE, Groups.UPDATE], message: validation.number('quantity') }
  )
  @Column({ nullable: false, type: 'float' })
  quantity: number;

  @Expose({ groups: [Groups.CREATE, Groups.READ] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('contractItemId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('contractItemId') })
  @RelationId('contractItem')
  contractItemId: string;

  @Expose({ groups: [Groups.CREATE, Groups.READ] })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('estimateId') })
  @IsString({ groups: [Groups.CREATE], message: validation.string('estimateId') })
  @RelationId('estimate')
  estimateId: string;

  @ManyToOne(() => Estimate, estimate => estimate.estimateItems, { onDelete: 'CASCADE' })
  estimate: Estimate;

  @ManyToOne(() => ContractItem, contractItem => contractItem.estimateItems, {
    onDelete: 'CASCADE',
  })
  contractItem: ContractItem;
}
