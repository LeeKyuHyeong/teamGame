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
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        timezone: '+09:00',
        bigNumberStrings: false, // bigint를 문자열이 아닌 숫자로 반환
        supportBigNumbers: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
