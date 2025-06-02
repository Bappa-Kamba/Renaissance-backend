import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player, PlayerPosition } from '../../src/players/entities/player.entity';
import { AppModule } from '../../src/app.module';
import { BaseE2eTest } from '../common/base.e2e-spec';

describe('PlayersController (e2e)', () => {
  class PlayersE2eTest extends BaseE2eTest<Player> {
    constructor(private playerRepository: Repository<Player>) {
      super();
    }

    protected getRepository(): Repository<Player> {
      return this.playerRepository;
    }

    protected getResourcePath(): string {
      return 'players';
    }

    protected getCreateDto(): any {
      return {
        firstName: `Test${Date.now()}`,
        lastName: `Player${Date.now()}`,
        nickname: 'Tester',
        dateOfBirth: '1990-01-01',
        nationality: 'Test Nation',
        height: 180,
        weight: 75,
        position: PlayerPosition.MIDFIELDER,
        jerseyNumber: 10,
        photo: 'https://example.com/photo.jpg',
        biography: 'Test player biography',
        isActive: true,
      };
    }

    protected getUpdateDto(): any {
      return {
        firstName: `Updated${Date.now()}`,
        lastName: `Player${Date.now()}`,
        biography: 'Updated player biography',
      };
    }

    protected getEntityName(): string {
      return 'Player';
    }
  }

  let playersTest: PlayersE2eTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const playerRepository = moduleFixture.get<Repository<Player>>(getRepositoryToken(Player));
    playersTest = new PlayersE2eTest(playerRepository);
    await playersTest.beforeAll();
  });

  afterAll(async () => {
    await playersTest.afterAll();
  });

  it('should perform CRUD operations', async () => {
    await playersTest.testCrudOperations();
  });

  it('should handle pagination correctly', async () => {
    await playersTest.testPagination();
  });

  it('should handle sorting correctly', async () => {
    await playersTest.testSorting();
  });

  it('should handle errors correctly', async () => {
    await playersTest.testErrorHandling();
  });
});
