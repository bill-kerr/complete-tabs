import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { CREATE, READ, READ_CREATE } from '../groups';
import { validation } from '../../validation';

@Exclude()
export class User {
  @Expose({ groups: READ })
  object = 'user';

  @Expose({ groups: READ })
  id: string;

  @Expose({ groups: READ_CREATE })
  @IsEmail({}, { groups: CREATE, message: validation.email() })
  email: string;

  @Expose({ groups: READ_CREATE })
  @IsOptional({ groups: CREATE })
  @IsString({ groups: CREATE, message: validation.string('organizationId') })
  organizationId: string;

  @Expose({ groups: CREATE })
  @Length(6, 255, {
    groups: CREATE,
    message: validation.length('password', 6, 255),
  })
  password: string;
}
