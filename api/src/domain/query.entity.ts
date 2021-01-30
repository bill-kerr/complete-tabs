import { IsInt, IsOptional } from 'class-validator';
import { validation } from '../validation';

export class Query {
  @IsOptional()
  @IsInt({ message: validation.integer('page') })
  page: number;

  @IsOptional()
  @IsInt({ message: validation.integer('limit') })
  limit: number;
}
