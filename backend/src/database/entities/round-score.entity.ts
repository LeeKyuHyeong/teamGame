import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { GameRound } from './game-round.entity';
import { Team } from './team.entity';

@Entity('round_scores')
@Unique(['roundId', 'teamId'])
export class RoundScore {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'round_id' })
  roundId: number;

  @Column({ type: 'bigint', name: 'team_id' })
  teamId: number;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'int', nullable: true, name: 'correct_count' })
  correctCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => GameRound, (gameRound) => gameRound.roundScores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'round_id' })
  round: GameRound;

  @ManyToOne(() => Team, (team) => team.roundScores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
