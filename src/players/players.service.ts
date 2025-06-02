import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationDto, createPaginatedResponse } from '../common/dto/pagination.dto';
import { SortingDto } from '../common/dto/sorting.dto';
import { ResourceNotFoundException } from '../common/exceptions/api-exception';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  async findAll(paginationDto: PaginationDto, sortingDto: SortingDto, filters?: any) {
    const queryBuilder = this.playerRepository.createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team');

    // Apply filters if provided
    if (filters) {
      if (filters.name) {
        queryBuilder.andWhere(
          '(player.firstName ILIKE :name OR player.lastName ILIKE :name OR player.nickname ILIKE :name)',
          { name: `%${filters.name}%` },
        );
      }
      if (filters.position) {
        queryBuilder.andWhere('player.position = :position', { position: filters.position });
      }
      if (filters.nationality) {
        queryBuilder.andWhere('player.nationality = :nationality', { nationality: filters.nationality });
      }
      if (filters.teamId) {
        queryBuilder.andWhere('player.teamId = :teamId', { teamId: filters.teamId });
      }
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('player.isActive = :isActive', { isActive: filters.isActive });
      }
    }

    // Apply sorting
    const orderBy = sortingDto.getOrderBy();
    if (orderBy) {
      const [field, order] = Object.entries(orderBy)[0];
      queryBuilder.orderBy(`player.${field}`, order);
    } else {
      // Default sorting
      queryBuilder.orderBy('player.lastName', 'ASC');
    }

    // Apply pagination
    queryBuilder.skip(paginationDto.skip).take(paginationDto.limit);

    // Execute query
    const [items, totalItems] = await queryBuilder.getManyAndCount();

    // Return paginated response
    return createPaginatedResponse(items, totalItems, paginationDto);
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    
    if (!player) {
      throw new ResourceNotFoundException('Player', id);
    }
    
    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    Object.assign(player, updatePlayerDto);
    return this.playerRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
