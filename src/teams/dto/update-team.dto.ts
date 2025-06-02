import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'Manchester United', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: 'England', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'Manchester', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Old Trafford', required: false })
  @IsString()
  @IsOptional()
  stadium?: string;

  @ApiProperty({ example: 1878, required: false })
  @IsInt()
  @Min(1800)
  @IsOptional()
  foundedYear?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'One of the most successful clubs in England', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
