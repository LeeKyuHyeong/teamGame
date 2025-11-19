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
import { GamesService } from './games.service';
import { CreateSessionGameDto } from './dto/create-session-game.dto';
import { StartGameDto } from './dto/start-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // 게임 타입 목록 조회
  @Get('types')
  getGameTypes() {
    return this.gamesService.getGameTypes();
  }

  // 세션의 게임 목록 조회
  @Get()
  findBySession(@Query('sessionId') sessionId: string) {
    return this.gamesService.findBySession(+sessionId);
  }

  // 게임 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  // 세션에 게임 추가
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addGameToSession(@Body() createSessionGameDto: CreateSessionGameDto) {
    return this.gamesService.addGameToSession(createSessionGameDto);
  }

  // 게임 시작
  @Patch(':id/start')
  startGame(@Param('id') id: string, @Body() startGameDto: StartGameDto) {
    return this.gamesService.startGame(+id, startGameDto);
  }

  // 게임 완료
  @Patch(':id/complete')
  completeGame(@Param('id') id: string) {
    return this.gamesService.completeGame(+id);
  }

  // 게임 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
