import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Team } from './team.entity';
import { SessionGame } from './session-game.entity';

export enum SessionStatus {
  READY = '준비중',
  IN_PROGRESS = '진행중',
  COMPLETED = '완료',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'session_name' })
  sessionName: string;

  @Column({
    type: 'datetime',
    name: 'session_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sessionDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'mc_name' })
  mcName: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.READY,
  })
  status: SessionStatus;

  @Column({ type: 'int', default: 15, name: 'total_participants' })
  totalParticipants: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Team, (team) => team.session)
  teams: Team[];

  @OneToMany(() => SessionGame, (sessionGame) => sessionGame.session)
  sessionGames: SessionGame[];
}
