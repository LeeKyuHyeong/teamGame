import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';
import { GameRound } from '../../database/entities/game-round.entity';
import { Song } from '../../database/entities/song.entity';
import { MediaContent } from '../../database/entities/media-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameRound,
      Song,
      MediaContent,
    ]),
  ],
  controllers: [RoundsController],
  providers: [RoundsService],
  exports: [RoundsService],
})
export class RoundsModule {}
