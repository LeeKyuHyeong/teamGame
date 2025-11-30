import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../../database/entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const song = this.songRepository.create(createSongDto);
    return await this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id },
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    return song;
  }

  async update(id: number, updateSongDto: Partial<CreateSongDto>): Promise<Song> {
    const song = await this.findOne(id);
    Object.assign(song, updateSongDto);
    return await this.songRepository.save(song);
  }

  async remove(id: number): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }

  // 랜덤 노래 가져오기
  async getRandom(count: number = 5, releaseYear?: String): Promise<Song[]> {
    const queryBuilder = this.songRepository
      .createQueryBuilder('song');
    
    // 연도 필터 추가
    if (releaseYear) {
      queryBuilder.where('song.release_year = :releaseYear', { releaseYear });
    }
    
    const songs = await queryBuilder
      .orderBy('RAND()')
      .limit(count)
      .getMany();
      
    return songs;
  }

  // 사용 가능한 연도 목록 가져오기
  async getAvailableYears(): Promise<String[]> {
    const result = await this.songRepository
      .createQueryBuilder('song')
      .select('DISTINCT song.release_year', 'year')
      .where('song.release_year IS NOT NULL')
      .orderBy('song.release_year', 'DESC')
      .getRawMany();
    
    return result.map(r => r.year);
  }
}
