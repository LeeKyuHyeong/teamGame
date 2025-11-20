import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaContent } from '../../database/entities/media-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaContent]),
    MulterModule.register({
      dest: './uploads/media',
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
