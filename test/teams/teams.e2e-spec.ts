import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../src/teams/entities/team.entity';
import { AppModule } from '../../src/app.module';
import { BaseE2eTest } from '../common/base.e2e-spec';

describe('TeamsController (e2e)', () => {
  class TeamsE2eTest extends BaseE2eTest<Team> {
    constructor(private teamRepository: Repository<Team>) {
      super();
    }

    protected getRepository(): Repository<Team> {
      return this.teamRepository;
    }

    protected getResourcePath(): string {
      return 'teams';
    }

    protected getCreateDto(): any {
      return {
        name: `Test Team ${Date.now()}`,
        country: 'Test Country',
        city: 'Test City',
        stadium: 'Test Stadium',
        foundedYear: 2000,
        logo: 'https://example.com/logo.png',
        description: 'Test team description',
        isActive: true,
      };
    }

    protected getUpdateDto(): any {
      return {
        name: `Updated Team ${Date.now()}`,
        description: 'Updated team description',
      };
    }

    protected getEntityName(): string {
      return 'Team';
    }
  }

  let teamsTest: TeamsE2eTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const teamRepository = moduleFixture.get<Repository<Team>>(getRepositoryToken(Team));
    teamsTest = new TeamsE2eTest(teamRepository);
    await teamsTest.beforeAll();
  });

  afterAll(async () => {
    await teamsTest.afterAll();
  });

  it('should perform CRUD operations', async () => {
    await teamsTest.testCrudOperations();
  });

  it('should handle pagination correctly', async () => {
    await teamsTest.testPagination();
  });

  it('should handle sorting correctly', async () => {
    await teamsTest.testSorting();
  });

  it('should handle errors correctly', async () => {
    await teamsTest.testErrorHandling();
  });
});
