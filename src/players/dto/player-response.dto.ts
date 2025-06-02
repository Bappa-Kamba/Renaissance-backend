import { ApiProperty } from '@nestjs/swagger';
import { PlayerPosition } from '../entities/player.entity';
import { TeamResponseDto } from '../../teams/dto/team-response.dto';

export class PlayerResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Lionel' })
  firstName: string;

  @ApiProperty({ example: 'Messi' })
  lastName: string;

  @ApiProperty({ example: 'Leo', nullable: true })
  nickname: string | null;

  @ApiProperty({ example: '1987-06-24', nullable: true })
  dateOfBirth: Date | null;

  @ApiProperty({ example: 'Argentina', nullable: true })
  nationality: string | null;

  @ApiProperty({ example: 170, nullable: true, description: 'Height in cm' })
  height: number | null;

  @ApiProperty({ example: 72, nullable: true, description: 'Weight in kg' })
  weight: number | null;

  @ApiProperty({ enum: PlayerPosition, example: PlayerPosition.FORWARD })
  position: PlayerPosition;

  @ApiProperty({ example: 10, nullable: true })
  jerseyNumber: number | null;

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  photo: string | null;

  @ApiProperty({ example: 'One of the greatest players of all time', nullable: true })
  biography: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: () => TeamResponseDto, nullable: true })
  team: TeamResponseDto | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
  teamId: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updatedAt: Date;
}
