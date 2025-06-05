import { Controller, Body, Param, Delete, Put, Get, Post, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeamResponseDto } from './dto/team-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortingDto } from '../common/dto/sorting.dto';
import { BaseController } from '../common/controllers/base.controller';
import { Team } from './entities/team.entity';

@ApiTags('teams')
@Controller('api/v1/teams')
export class TeamsController extends BaseController<Team, CreateTeamDto, UpdateTeamDto, TeamResponseDto> {
  constructor(private readonly teamsService: TeamsService) {
    super(teamsService, 'Team');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'The team has been successfully created.', type: TeamResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Team with this name already exists' })
  async create(@Body() createDto: CreateTeamDto): Promise<TeamResponseDto> {
    return super.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number, example: 10 })
  @ApiQuery({ name: 'sort', required: false, description: 'Field to sort by', type: String, example: 'name' })
  @ApiQuery({ name: 'order', required: false, description: 'Sort order (asc or desc)', enum: ['asc', 'desc'], example: 'asc' })
  @ApiResponse({ status: 200, description: 'List of teams with pagination metadata' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortingDto: SortingDto,
  ) {
    return super.findAll(paginationDto, sortingDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID', type: String })
  @ApiResponse({ status: 200, description: 'The found team', type: TeamResponseDto })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findOne(@Param('id') id: string): Promise<TeamResponseDto> {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiParam({ name: 'id', description: 'Team ID', type: String })
  @ApiResponse({ status: 200, description: 'The updated team', type: TeamResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', description: 'Team ID', type: String })
  @ApiResponse({ status: 204, description: 'Team successfully deleted' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return super.remove(id);
  }
}
