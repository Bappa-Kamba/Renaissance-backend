import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerResponseDto } from './dto/player-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortingDto } from '../common/dto/sorting.dto';
import { PlayerPosition } from './entities/player.entity';

@ApiTags('players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new player' })
  @ApiResponse({
    status: 201,
    description: 'The player has been successfully created.',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerResponseDto> {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all players' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Sort direction' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name (partial match on firstName, lastName, or nickname)' })
  @ApiQuery({ name: 'position', required: false, enum: PlayerPosition, description: 'Filter by position' })
  @ApiQuery({ name: 'nationality', required: false, type: String, description: 'Filter by nationality (exact match)' })
  @ApiQuery({ name: 'teamId', required: false, type: String, description: 'Filter by team ID' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({
    status: 200,
    description: 'List of players',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PlayerResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalItems: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortingDto: SortingDto,
    @Query('name') name?: string,
    @Query('position') position?: PlayerPosition,
    @Query('nationality') nationality?: string,
    @Query('teamId') teamId?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    const filters = { name, position, nationality, teamId, isActive };
    return this.playersService.findAll(paginationDto, sortingDto, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by ID' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiResponse({
    status: 200,
    description: 'The player has been found.',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  async findOne(@Param('id') id: string): Promise<PlayerResponseDto> {
    return this.playersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a player' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiResponse({
    status: 200,
    description: 'The player has been successfully updated.',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerResponseDto> {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a player' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiResponse({ status: 204, description: 'The player has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.playersService.remove(id);
  }
}
