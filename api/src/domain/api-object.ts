import { Expose } from 'class-transformer';
import { BaseEntity, BeforeInsert, PrimaryColumn } from 'typeorm';
import { uuid } from '../utils';
import { BadRequestError, InternalServerError } from '../errors';
import { DatabaseError, getDatabaseError } from '../loaders/database';
import { READ } from './groups';

export abstract class ApiObject extends BaseEntity {
  @Expose({ groups: READ })
  abstract object: string;

  @Expose({ groups: READ })
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuid();
    }
  }

  public async persist() {
    try {
      await this.save();
    } catch (error) {
      switch (getDatabaseError(error)) {
        case DatabaseError.DUPLICATE:
          throw new BadRequestError(`A ${this.object} with that name already exists.`);
        default:
          throw new InternalServerError(error);
      }
    }
  }

  public async delete() {
    try {
      await this.remove();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}
