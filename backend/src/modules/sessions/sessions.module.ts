import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { Session } from '../../database/entities/session.entity';
import { Team } from '../../database/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Team])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
