import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Participant } from './participant.entity';
import { RoundScore } from './round-score.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'session_id' })
  sessionId: number;

  @Column({ type: 'varchar', length: 50, name: 'team_name' })
  teamName: string;

  @Column({ type: 'int', default: 0, name: 'total_score' })
  totalScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Session, (session) => session.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @OneToMany(() => Participant, (participant) => participant.team)
  participants: Participant[];

  @OneToMany(() => RoundScore, (roundScore) => roundScore.team)
  roundScores: RoundScore[];
}
