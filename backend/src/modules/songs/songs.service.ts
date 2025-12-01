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

  // 랜덤 노래 가져오기 (년대별 필터링)
  async getRandom(count: number = 5, decade?: string): Promise<Song[]> {
    console.log('[SongsService] getRandom 호출, count:', count, 'decade:', decade);
    
    const queryBuilder = this.songRepository
      .createQueryBuilder('song');
    
    // 년대 필터 추가
    if (decade) {
      let startYear: number;
      let endYear: number;
      
      switch(decade) {
        case '1990s':
          startYear = 1990;
          endYear = 1999;
          break;
        case '2000s':
          startYear = 2000;
          endYear = 2009;
          break;
        case '2010s':
          startYear = 2010;
          endYear = 2019;
          break;
        case '2020s':
          startYear = 2020;
          endYear = 2029;
          break;
        default:
          startYear = 1900;
          endYear = 2100;
      }
      
      console.log(`[SongsService] 년도 필터: ${startYear} ~ ${endYear}`);
      queryBuilder.where('song.release_year BETWEEN :startYear AND :endYear', {
        startYear,
        endYear,
      });
    }
    
    const songs = await queryBuilder
      .orderBy('RAND()')
      .limit(count)
      .getMany();
    
    console.log('[SongsService] 조회된 노래 수:', songs.length);
      
    return songs;
  }

  // 사용 가능한 년대 목록 가져오기
  async getAvailableDecades(): Promise<{ decade: string; label: string; count: number }[]> {
    console.log('[SongsService] getAvailableDecades 호출');
    
    // 모든 노래 조회
    const songs = await this.songRepository.find({
      select: ['releaseYear'],
    });
    
    console.log('[SongsService] 전체 노래 개수:', songs.length);
    if (songs.length > 0) {
      console.log('[SongsService] 첫 번째 노래의 releaseYear:', songs[0].releaseYear);
    }
    
    const decades = {
      '1990s': { label: '1990년대', count: 0 },
      '2000s': { label: '2000년대', count: 0 },
      '2010s': { label: '2010년대', count: 0 },
      '2020s': { label: '2020년대', count: 0 },
    };
    
    songs.forEach(song => {
      const year = song.releaseYear;
      if (!year) {
        console.log('[SongsService] releaseYear가 null인 노래 발견');
        return;
      }
      
      if (year >= 1990 && year <= 1999) {
        decades['1990s'].count++;
      } else if (year >= 2000 && year <= 2009) {
        decades['2000s'].count++;
      } else if (year >= 2010 && year <= 2019) {
        decades['2010s'].count++;
      } else if (year >= 2020 && year <= 2029) {
        decades['2020s'].count++;
      } else {
        console.log(`[SongsService] 범위 밖 연도: ${year}`);
      }
    });
    
    console.log('[SongsService] 년대별 카운트:', JSON.stringify(decades, null, 2));
    
    const result = Object.entries(decades)
      .filter(([_, data]) => data.count > 0)
      .map(([decade, data]) => ({
        decade,
        label: data.label,
        count: data.count,
      }));
    
    console.log('[SongsService] 반환 결과:', JSON.stringify(result, null, 2));
    
    return result;
  }
}
