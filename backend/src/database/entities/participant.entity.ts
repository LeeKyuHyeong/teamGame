import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Team } from './team.entity';
import { RoundScore } from './round-score.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'team_id' })
  teamId: number;

  @Column({ type: 'varchar', length: 50, name: 'participant_name' })
  participantName: string;

  @Column({ type: 'boolean', default: false, name: 'is_mc' })
  isMc: boolean;

  @Column({ type: 'int', default: 0, name: 'total_score' })
  totalScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Team, (team) => team.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany(() => RoundScore, (roundScore) => roundScore.participant)
  roundScores: RoundScore[];
}
