import { Repository } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { PaginationDto, createPaginatedResponse } from '../dto/pagination.dto';
import { SortingDto } from '../dto/sorting.dto';
import { ResourceNotFoundException } from '../exceptions/api-exception';

export abstract class BaseService<T extends BaseEntity, CreateDto, UpdateDto> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly resourceName: string,
  ) {}

  async create(createDto: CreateDto): Promise<T> {
    const entity = this.repository.create(createDto as any);
    return this.repository.save(entity);
  }

  async findAll(paginationDto: PaginationDto, sortingDto: SortingDto, filters?: any) {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    
    // Apply filters if provided
    if (filters) {
      this.applyFilters(queryBuilder, filters);
    }

    // Apply sorting
    const orderBy = sortingDto.getOrderBy();
    if (orderBy) {
      const [field, order] = Object.entries(orderBy)[0];
      queryBuilder.orderBy(`entity.${field}`, order);
    } else {
      // Default sorting by creation date
      queryBuilder.orderBy('entity.createdAt', 'DESC');
    }

    // Apply pagination
    queryBuilder.skip(paginationDto.skip).take(paginationDto.limit);

    // Execute query
    const [items, totalItems] = await queryBuilder.getManyAndCount();

    // Return paginated response
    return createPaginatedResponse(items, totalItems, paginationDto);
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    
    if (!entity) {
      throw new ResourceNotFoundException(this.resourceName, id);
    }
    
    return entity;
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  // This method should be overridden by child classes to apply specific filters
  protected applyFilters(queryBuilder: any, filters: any): void {
    // Default implementation does nothing
  }
}
