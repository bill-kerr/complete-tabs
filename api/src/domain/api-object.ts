import { Expose } from 'class-transformer';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, PrimaryColumn } from 'typeorm';
import { unixTime, uuid } from '../utils';
import { BadRequestError, InternalServerError } from '../errors';
import { DatabaseError, getDatabaseError } from '../loaders/database';
import { Groups } from './groups';

export abstract class ApiObject extends BaseEntity {
  @Expose({ groups: [Groups.READ] })
  abstract object: string;

  @Expose({ groups: [Groups.READ] })
  @PrimaryColumn('uuid')
  id: string;

  @Expose({ groups: [Groups.READ] })
  @Column({ name: 'created_at', default: 0 })
  createdAt: number;

  @Expose({ groups: [Groups.READ] })
  @Column({ name: 'updated_at', default: 0 })
  updatedAt: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuid();
    }
  }

  @BeforeInsert()
  addCreatedTimestamp() {
    this.createdAt = unixTime();
  }

  @BeforeUpdate()
  @BeforeInsert()
  updateUpdatedTimestamp() {
    this.updatedAt = unixTime();
  }

  public async persist() {
    try {
      await this.save();
    } catch (error) {
      switch (getDatabaseError(error)) {
        case DatabaseError.DUPLICATE:
          throw new BadRequestError(
            `You attempted to set a unique property on ${this.object} to a value that already exists.`
          );
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
