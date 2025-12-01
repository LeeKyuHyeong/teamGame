import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  // ✅ 1순위: 구체적인 경로
  @Get('decades/available')
  async getAvailableDecades() {
    console.log('[SongsController] GET /songs/decades/available 호출됨');
    const result = await this.songsService.getAvailableDecades();
    console.log('[SongsController] 반환 결과:', result);
    return result;
  }

  // ✅ 2순위: 쿼리 파라미터
  @Get()
  findAll(@Query('random') random?: string, @Query('decade') decade?: string) {
    console.log('[SongsController] GET /songs 호출됨, random:', random, 'decade:', decade);
    if (random) {
      const count = parseInt(random) || 5;
      return this.songsService.getRandom(count, decade);
    }
    return this.songsService.findAll();
  }

  // ✅ 3순위: 동적 파라미터 (맨 마지막)
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('[SongsController] GET /songs/:id 호출됨, id:', id);
    return this.songsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: Partial<CreateSongDto>) {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.songsService.remove(+id);
  }
}
