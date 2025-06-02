import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortingDto {
  @ApiProperty({
    description: 'Field to sort by',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({
    description: 'Sort direction',
    enum: SortOrder,
    default: SortOrder.ASC,
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder = SortOrder.ASC;

  getOrderBy(): Record<string, 'ASC' | 'DESC'> | undefined {
    if (!this.sort) return undefined;
    
    return {
      [this.sort]: this.order === SortOrder.ASC ? 'ASC' : 'DESC',
    };
  }
}
