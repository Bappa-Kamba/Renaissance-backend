import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Team } from '../../teams/entities/team.entity';

export enum PlayerPosition {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward',
}

@Entity('players')
export class Player extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({
    type: 'enum',
    enum: PlayerPosition,
    default: PlayerPosition.MIDFIELDER,
  })
  position: PlayerPosition;

  @Column({ nullable: true })
  jerseyNumber: number;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ nullable: true })
  teamId: string;
}
