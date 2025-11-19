import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { ActionItem } from '../../database/entities/action-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionItem])],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
