import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerPosition } from '../entities/player.entity';

export class UpdatePlayerDto {
  @ApiProperty({ example: 'Lionel', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Messi', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Leo', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ example: '1987-06-24', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({ example: 'Argentina', required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: 170, required: false, description: 'Height in cm' })
  @IsNumber()
  @Min(100)
  @Max(250)
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 72, required: false, description: 'Weight in kg' })
  @IsNumber()
  @Min(40)
  @Max(150)
  @IsOptional()
  weight?: number;

  @ApiProperty({ enum: PlayerPosition, example: PlayerPosition.FORWARD, required: false })
  @IsEnum(PlayerPosition)
  @IsOptional()
  position?: PlayerPosition;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  jerseyNumber?: number;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({ example: 'One of the greatest players of all time', required: false })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  teamId?: string;
}
