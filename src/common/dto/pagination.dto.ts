import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty()
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };

  constructor(items: T[], totalItems: number, paginationDto: PaginationDto) {
    this.items = items;
    this.meta = {
      page: paginationDto.page,
      limit: paginationDto.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / paginationDto.limit),
    };
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  paginationDto: PaginationDto,
): PaginatedResponseDto<T> {
  return new PaginatedResponseDto(items, totalItems, paginationDto);
}
