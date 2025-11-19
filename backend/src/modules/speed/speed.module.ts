import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeedService } from './speed.service';
import { SpeedController } from './speed.controller';
import { SpeedCategory } from '../../database/entities/speed-category.entity';
import { SpeedItem } from '../../database/entities/speed-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpeedCategory, SpeedItem])],
  controllers: [SpeedController],
  providers: [SpeedService],
  exports: [SpeedService],
})
export class SpeedModule {}
