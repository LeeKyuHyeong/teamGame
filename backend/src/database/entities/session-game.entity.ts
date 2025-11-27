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
import { GameType } from './game-type.entity';
import { GameRound } from './game-round.entity';

export enum GameStatus {
  WAITING = '대기',
  IN_PROGRESS = '진행중',
  COMPLETED = '완료',
}

@Entity('session_games')
export class SessionGame {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'session_id' })
  sessionId: number;

  @Column({ type: 'int', name: 'game_type_id' })
  gameTypeId: number;

  @Column({ type: 'int', name: 'game_order' })
  gameOrder: number;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Session, (session) => session.sessionGames, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => GameType, (gameType) => gameType.sessionGames)
  @JoinColumn({ name: 'game_type_id' })
  gameType: GameType;

  @OneToMany(() => GameRound, (gameRound) => gameRound.sessionGame)
  gameRounds: GameRound[];
}
