import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { GamesModule } from './modules/games/games.module';
import { RoundsModule } from './modules/rounds/rounds.module';
import { ScoresModule } from './modules/scores/scores.module';
import { SongsModule } from './modules/songs/songs.module';
import { MediaModule } from './modules/media/media.module';
import { SpeedModule } from './modules/speed/speed.module';
import { ActionsModule } from './modules/actions/actions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        timezone: '+09:00',
      }),
    }),
    SessionsModule,
    TeamsModule,
    ParticipantsModule,
    GamesModule,
    RoundsModule,
    ScoresModule,
    SongsModule,
    MediaModule,
    SpeedModule,
    ActionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
