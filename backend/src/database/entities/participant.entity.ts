import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'team_id' })
  teamId: number;

  @Column({ type: 'varchar', length: 50, name: 'participant_name' })
  participantName: string;

  @Column({ type: 'boolean', default: false, name: 'is_mc' })
  isMc: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Team, (team) => team.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
