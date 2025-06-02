import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { BaseEntity } from '../../src/common/entities/base.entity';
import { AppModule } from '../../src/app.module';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';

export abstract class BaseE2eTest<T extends BaseEntity> {
  protected app: INestApplication;
  protected repository: Repository<T>;
  protected resourcePath: string;
  protected createDto: any;
  protected updateDto: any;
  protected entityName: string;

  protected abstract getRepository(): Repository<T>;
  protected abstract getResourcePath(): string;
  protected abstract getCreateDto(): any;
  protected abstract getUpdateDto(): any;
  protected abstract getEntityName(): string;

  async beforeAll() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalInterceptors(new ResponseInterceptor());
    this.app.useGlobalFilters(new HttpExceptionFilter());
    await this.app.init();

    this.repository = this.getRepository();
    this.resourcePath = this.getResourcePath();
    this.createDto = this.getCreateDto();
    this.updateDto = this.getUpdateDto();
    this.entityName = this.getEntityName();
  }

  async afterAll() {
    await this.app.close();
  }

  async testCrudOperations() {
    // Test creating a resource
    const createResponse = await request(this.app.getHttpServer())
      .post(`/api/v1/${this.resourcePath}`)
      .send(this.createDto)
      .expect(201);

    expect(createResponse.body.data).toBeDefined();
    const createdId = createResponse.body.data.id;

    // Test getting all resources
    const getAllResponse = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}`)
      .expect(200);

    expect(getAllResponse.body.data).toBeInstanceOf(Array);
    expect(getAllResponse.body.meta).toBeDefined();
    expect(getAllResponse.body.meta.totalItems).toBeGreaterThanOrEqual(1);

    // Test getting a specific resource
    const getOneResponse = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}/${createdId}`)
      .expect(200);

    expect(getOneResponse.body.data).toBeDefined();
    expect(getOneResponse.body.data.id).toEqual(createdId);

    // Test updating a resource
    const updateResponse = await request(this.app.getHttpServer())
      .put(`/api/v1/${this.resourcePath}/${createdId}`)
      .send(this.updateDto)
      .expect(200);

    expect(updateResponse.body.data).toBeDefined();
    expect(updateResponse.body.data.id).toEqual(createdId);

    // Test deleting a resource
    await request(this.app.getHttpServer())
      .delete(`/api/v1/${this.resourcePath}/${createdId}`)
      .expect(204);

    // Verify resource was deleted
    await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}/${createdId}`)
      .expect(404);
  }

  async testPagination() {
    // Create multiple resources for pagination testing
    for (let i = 0; i < 5; i++) {
      await request(this.app.getHttpServer())
        .post(`/api/v1/${this.resourcePath}`)
        .send(this.createDto)
        .expect(201);
    }

    // Test pagination with different page sizes
    const pageSize = 2;
    const response = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}?page=1&limit=${pageSize}`)
      .expect(200);

    expect(response.body.data.length).toBeLessThanOrEqual(pageSize);
    expect(response.body.meta.page).toEqual(1);
    expect(response.body.meta.limit).toEqual(pageSize);
    expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(5);

    // Test second page
    const secondPageResponse = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}?page=2&limit=${pageSize}`)
      .expect(200);

    expect(secondPageResponse.body.meta.page).toEqual(2);
  }

  async testSorting() {
    // Test sorting by creation date
    const ascResponse = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}?sort=createdAt&order=asc`)
      .expect(200);

    const descResponse = await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}?sort=createdAt&order=desc`)
      .expect(200);

    if (ascResponse.body.data.length > 1 && descResponse.body.data.length > 1) {
      const ascDates = ascResponse.body.data.map(item => new Date(item.createdAt).getTime());
      const descDates = descResponse.body.data.map(item => new Date(item.createdAt).getTime());

      // Check if ascDates are in ascending order
      for (let i = 0; i < ascDates.length - 1; i++) {
        expect(ascDates[i]).toBeLessThanOrEqual(ascDates[i + 1]);
      }

      // Check if descDates are in descending order
      for (let i = 0; i < descDates.length - 1; i++) {
        expect(descDates[i]).toBeGreaterThanOrEqual(descDates[i + 1]);
      }
    }
  }

  async testErrorHandling() {
    // Test 404 for non-existent resource
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    await request(this.app.getHttpServer())
      .get(`/api/v1/${this.resourcePath}/${nonExistentId}`)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBeDefined();
        expect(res.body.error.code).toEqual('RESOURCE_NOT_FOUND');
        expect(res.body.error.message).toContain(this.entityName);
      });

    // Test validation error with invalid data
    const invalidData = {}; // Empty object should fail validation
    await request(this.app.getHttpServer())
      .post(`/api/v1/${this.resourcePath}`)
      .send(invalidData)
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBeDefined();
        expect(res.body.error.code).toEqual('BAD_REQUEST');
      });
  }
}
