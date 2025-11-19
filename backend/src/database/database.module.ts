import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Session } from './entities/session.entity';
import { Team } from './entities/team.entity';
import { Participant } from './entities/participant.entity';
import { GameType } from './entities/game-type.entity';
import { SessionGame } from './entities/session-game.entity';
import { GameRound } from './entities/game-round.entity';
import { RoundScore } from './entities/round-score.entity';
import { Song } from './entities/song.entity';
import { MediaContent } from './entities/media-content.entity';
import { SpeedCategory } from './entities/speed-category.entity';
import { SpeedItem } from './entities/speed-item.entity';
import { ActionItem } from './entities/action-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Session,
          Team,
          Participant,
          GameType,
          SessionGame,
          GameRound,
          RoundScore,
          Song,
          MediaContent,
          SpeedCategory,
          SpeedItem,
          ActionItem,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        timezone: '+09:00',
      }),
    }),
  ],
})
export class DatabaseModule {}
