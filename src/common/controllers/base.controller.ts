import { Body, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BaseService } from '../services/base.service';
import { BaseEntity } from '../entities/base.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { SortingDto } from '../dto/sorting.dto';

export abstract class BaseController<T extends BaseEntity, CreateDto, UpdateDto, ResponseDto> {
  constructor(
    protected readonly service: BaseService<T, CreateDto, UpdateDto>,
    protected readonly resourceName: string,
  ) {}

  @Post()
  @ApiOperation({ summary: `Create a new ${this.resourceName}` })
  @ApiResponse({
    status: 201,
    description: `The ${this.resourceName} has been successfully created.`,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createDto: CreateDto): Promise<ResponseDto> {
    return this.service.create(createDto) as unknown as ResponseDto;
  }

  @Get()
  @ApiOperation({ summary: `Get all ${this.resourceName}s` })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Sort direction' })
  @ApiResponse({ status: 200, description: `List of ${this.resourceName}s` })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortingDto: SortingDto,
  ) {
    return this.service.findAll(paginationDto, sortingDto);
  }

  @Get(':id')
  @ApiOperation({ summary: `Get a ${this.resourceName} by ID` })
  @ApiParam({ name: 'id', description: `${this.resourceName} ID` })
  @ApiResponse({ status: 200, description: `The ${this.resourceName} has been found.` })
  @ApiResponse({ status: 404, description: `${this.resourceName} not found.` })
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    return this.service.findOne(id) as unknown as ResponseDto;
  }

  @Put(':id')
  @ApiOperation({ summary: `Update a ${this.resourceName}` })
  @ApiParam({ name: 'id', description: `${this.resourceName} ID` })
  @ApiResponse({ status: 200, description: `The ${this.resourceName} has been successfully updated.` })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: `${this.resourceName} not found.` })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<ResponseDto> {
    return this.service.update(id, updateDto) as unknown as ResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: `Delete a ${this.resourceName}` })
  @ApiParam({ name: 'id', description: `${this.resourceName} ID` })
  @ApiResponse({ status: 204, description: `The ${this.resourceName} has been successfully deleted.` })
  @ApiResponse({ status: 404, description: `${this.resourceName} not found.` })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
