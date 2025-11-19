import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { SessionGame } from '../../database/entities/session-game.entity';
import { GameType } from '../../database/entities/game-type.entity';
import { GameRound } from '../../database/entities/game-round.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionGame, GameType, GameRound])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
