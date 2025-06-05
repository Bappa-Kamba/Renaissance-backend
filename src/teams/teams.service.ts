import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { DuplicateResourceException } from '../common/exceptions/api-exception';
import { BaseService } from '../common/services/base.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortingDto } from '../common/dto/sorting.dto';
import { createPaginatedResponse } from '../common/utils/pagination';
import { ResourceNotFoundException } from '../common/exceptions/resource-not-found.exception';

@Injectable()
export class TeamsService extends BaseService<Team, CreateTeamDto, UpdateTeamDto> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {
    super(teamRepository, 'Team');
  }

  /**
   * Create a new team with duplicate name check
   * @param createTeamDto - Team data to create
   * @returns The created team
   */
  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    // Check if team with same name already exists
    const existingTeam = await this.teamRepository.findOne({
      where: { name: createTeamDto.name },
      withDeleted: true, // Include soft-deleted teams in the check
    });
    
    if (existingTeam) {
      throw new DuplicateResourceException('Team', 'name', createTeamDto.name);
    }
    
    return super.create(createTeamDto);
  }

  /**
   * Apply filters to the query builder
   * @param queryBuilder - The query builder to apply filters to
   * @param filters - The filters to apply
   */
  protected applyFilters(
    queryBuilder: SelectQueryBuilder<Team>,
    filters: Record<string, any>,
  ): void {
    if (filters?.name) {
      queryBuilder.andWhere('entity.name ILIKE :name', { name: `%${filters.name}%` });
    }
    if (filters?.country) {
      queryBuilder.andWhere('entity.country = :country', { country: filters.country });
    }
    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('entity.isActive = :isActive', { isActive: filters.isActive });
    }
  }

  /**
   * Find all teams with pagination, sorting, and filtering
   * @param paginationDto - Pagination options
   * @param sortingDto - Sorting options
   * @param filters - Filter criteria
   * @returns Paginated list of teams
   */
  async findAll(
    paginationDto: PaginationDto,
    sortingDto: SortingDto,
    filters?: Record<string, any>,
  ) {
    const queryBuilder = this.teamRepository.createQueryBuilder('team');

    // Apply filters if provided
    if (filters) {
      if (filters.name) {
        queryBuilder.andWhere('team.name ILIKE :name', { name: `%${filters.name}%` });
      }
      if (filters.country) {
        queryBuilder.andWhere('team.country = :country', { country: filters.country });
      }
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('team.isActive = :isActive', { isActive: filters.isActive });
      }
    }

    // Apply sorting
    const orderBy = sortingDto.getOrderBy();
    if (orderBy) {
      const [field, order] = Object.entries(orderBy)[0];
      queryBuilder.orderBy(`team.${field}`, order as 'ASC' | 'DESC');
    } else {
      // Default sorting
      queryBuilder.orderBy('team.name', 'ASC');
    }

    // Apply pagination
    queryBuilder.skip(paginationDto.skip).take(paginationDto.limit);

    // Execute query
    const [items, totalItems] = await queryBuilder.getManyAndCount();

    // Return paginated response
    return createPaginatedResponse(items, totalItems, paginationDto);
  }

  /**
   * Find a team by ID
   * @param id - Team ID
   * @returns The found team
   * @throws ResourceNotFoundException if team is not found
   */
  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new ResourceNotFoundException('Team', id);
    }
    return team;
  }

  /**
   * Update a team
   * @param id - Team ID
   * @param updateTeamDto - Team data to update
   * @returns The updated team
   */
  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    // Check for duplicate name if name is being updated
    if (updateTeamDto.name) {
      const existingTeam = await this.teamRepository.findOne({
        where: { name: updateTeamDto.name },
      });
      
      if (existingTeam && existingTeam.id !== id) {
        throw new DuplicateResourceException('Team', 'name', updateTeamDto.name);
      }
    }
    
    return super.update(id, updateTeamDto);
  }

  /**
   * Delete a team
   * @param id - Team ID
   * @returns void
   */
  async remove(id: string): Promise<void> {
    await super.remove(id);
  }
}
