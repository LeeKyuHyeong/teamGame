import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GameRound } from './game-round.entity';
import { Team } from './team.entity';
import { Participant } from './participant.entity';

@Entity('round_scores')
export class RoundScore {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'round_id' })
  roundId: number;

  @Column({ type: 'int', name: 'team_id' })
  teamId: number;

  @Column({ type: 'int', name: 'participant_id', nullable: true })
  participantId: number;

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

  @ManyToOne(() => Participant, (participant) => participant.roundScores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;
}
