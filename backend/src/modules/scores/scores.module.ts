import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { RoundScore } from '../../database/entities/round-score.entity';
import { Team } from '../../database/entities/team.entity';
import { Participant } from '../../database/entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoundScore, Team, Participant])],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
