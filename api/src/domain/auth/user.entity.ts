import { Exclude, Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { Groups } from '../groups';
import { validation } from '../../validation';

@Exclude()
export class User {
  @Expose({ groups: [Groups.READ] })
  object = 'user';

  @Expose({ groups: [Groups.READ] })
  id: string;

  @Expose({ groups: [Groups.READ, Groups.CREATE] })
  @IsEmail({}, { groups: [Groups.CREATE], message: validation.email() })
  email: string;

  @Expose({ groups: [Groups.CREATE] })
  @Length(6, 255, {
    groups: [Groups.CREATE],
    message: validation.length('password', 6, 255),
  })
  password: string;
}
