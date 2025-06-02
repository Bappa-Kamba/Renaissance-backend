import { ApiProperty } from '@nestjs/swagger';

export class TeamResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Manchester United' })
  name: string;

  @ApiProperty({ example: 'https://example.com/logo.png', nullable: true })
  logo: string | null;

  @ApiProperty({ example: 'England', nullable: true })
  country: string | null;

  @ApiProperty({ example: 'Manchester', nullable: true })
  city: string | null;

  @ApiProperty({ example: 'Old Trafford', nullable: true })
  stadium: string | null;

  @ApiProperty({ example: 1878, nullable: true })
  foundedYear: number | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'One of the most successful clubs in England', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updatedAt: Date;
}
