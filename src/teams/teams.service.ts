import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto, createPaginatedResponse } from '../common/dto/pagination.dto';
import { SortingDto } from '../common/dto/sorting.dto';
import { DuplicateResourceException, ResourceNotFoundException } from '../common/exceptions/api-exception';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    // Check if team with same name already exists
    const existingTeam = await this.teamRepository.findOne({
      where: { name: createTeamDto.name },
    });
    
    if (existingTeam) {
      throw new DuplicateResourceException('Team', 'name', createTeamDto.name);
    }
    
    const team = this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async findAll(paginationDto: PaginationDto, sortingDto: SortingDto, filters?: any) {
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
      queryBuilder.orderBy(`team.${field}`, order);
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

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new ResourceNotFoundException('Team', id);
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }
}
