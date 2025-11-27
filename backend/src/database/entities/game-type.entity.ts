import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SessionGame } from './session-game.entity';

@Entity('game_types')
export class GameType {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'game_code' })
  gameCode: string;

  @Column({ type: 'varchar', length: 50, name: 'game_name' })
  gameName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => SessionGame, (sessionGame) => sessionGame.gameType)
  sessionGames: SessionGame[];
}
