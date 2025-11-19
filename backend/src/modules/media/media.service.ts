import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaContent } from '../../database/entities/media-content.entity';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaContent)
    private readonly mediaRepository: Repository<MediaContent>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<MediaContent> {
    const media = this.mediaRepository.create(createMediaDto);
    return await this.mediaRepository.save(media);
  }

  async findAll(): Promise<MediaContent[]> {
    return await this.mediaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<MediaContent> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async update(id: number, updateDto: Partial<CreateMediaDto>): Promise<MediaContent> {
    const media = await this.findOne(id);
    Object.assign(media, updateDto);
    return await this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    await this.mediaRepository.remove(media);
  }

  async getRandom(count: number = 5): Promise<MediaContent[]> {
    return await this.mediaRepository
      .createQueryBuilder('media')
      .orderBy('RAND()')
      .limit(count)
      .getMany();
  }
}
