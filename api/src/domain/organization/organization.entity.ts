import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { Entity, Column } from 'typeorm';
import { validation } from '../../validation';
import { ALL, CREATE, CREATE_UPDATE } from '../groups';
import { ApiObject } from '../api-object';

@Entity()
@Exclude()
export class Organization extends ApiObject {
  object = 'organization';

  @Expose({ groups: ALL })
  @IsString({ groups: CREATE_UPDATE, message: validation.string('name') })
  @Length(3, 255, {
    groups: CREATE,
    message: validation.length('name', 3, 255),
  })
  @Column({ unique: true, nullable: false })
  name: string;
}
