import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Entity, Column, OneToMany } from 'typeorm';
import { validation } from '../../validation';
import { Groups } from '../groups';
import { ApiObject } from '../api-object';
import { Project } from '../project/project.entity';

@Entity()
@Exclude()
export class Organization extends ApiObject {
  object = 'organization';

  @Expose({ groups: Groups.all() })
  @IsNotEmpty({ groups: [Groups.CREATE], message: validation.required('name') })
  @IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string('name') })
  @Length(3, 255, {
    groups: [Groups.CREATE, Groups.UPDATE],
    message: validation.length('name', 3, 255),
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => Project, project => project.organization)
  projects: Project[];
}
