import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SessionGame } from './session-game.entity';
import { RoundScore } from './round-score.entity';

@Entity('game_rounds')
export class GameRound {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'session_game_id' })
  sessionGameId: number;

  @Column({ type: 'int', name: 'round_number' })
  roundNumber: number;

  @Column({ type: 'bigint', nullable: true, name: 'content_id' })
  contentId: number;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'content_type' })
  contentType: string;

  @Column({ type: 'bigint', nullable: true, name: 'team_id' })
  teamId: number;

  @Column({ type: 'boolean', default: false, name: 'is_answer_revealed' })
  isAnswerRevealed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SessionGame, (sessionGame) => sessionGame.gameRounds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_game_id' })
  sessionGame: SessionGame;

  @OneToMany(() => RoundScore, (roundScore) => roundScore.round)
  roundScores: RoundScore[];
}
