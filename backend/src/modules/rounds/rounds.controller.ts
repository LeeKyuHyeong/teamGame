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
import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { RevealAnswerDto } from './dto/reveal-answer.dto';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  // 라운드 생성
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.roundsService.create(createRoundDto);
  }

  // 게임의 라운드 목록 조회
  @Get()
  findByGame(@Query('sessionGameId') sessionGameId: string) {
    return this.roundsService.findByGame(+sessionGameId);
  }

  // 라운드 상세 조회 (콘텐츠 포함)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roundsService.findOneWithContent(+id);
  }

  // 다음 라운드 조회
  @Get('game/:sessionGameId/next')
  getNextRound(@Param('sessionGameId') sessionGameId: string) {
    return this.roundsService.getNextRound(+sessionGameId);
  }

  // 정답 공개/숨김
  @Patch(':id/reveal')
  revealAnswer(@Param('id') id: string, @Body() revealAnswerDto: RevealAnswerDto) {
    return this.roundsService.revealAnswer(+id, revealAnswerDto.reveal);
  }

  // 라운드 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.roundsService.remove(+id);
  }
}
