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
import { ScoresService } from './scores.service';
import { AssignScoreDto } from './dto/assign-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // 점수 부여
  @Post()
  @HttpCode(HttpStatus.CREATED)
  assignScore(@Body() assignScoreDto: AssignScoreDto) {
    return this.scoresService.assignScore(assignScoreDto);
  }

  // 라운드 또는 팀의 점수 조회
  @Get()
  find(
    @Query('roundId') roundId?: string,
    @Query('teamId') teamId?: string,
  ) {
    if (roundId) {
      return this.scoresService.findByRound(+roundId);
    }
    if (teamId) {
      return this.scoresService.findByTeam(+teamId);
    }
    return [];
  }

  // 점수 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoresService.findOne(+id);
  }

  // 라운드 점수 비교
  @Get('round/:roundId/compare')
  compareScores(@Param('roundId') roundId: string) {
    return this.scoresService.compareScores(+roundId);
  }

  // 점수 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoresService.update(+id, updateScoreDto);
  }

  // 점수 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.scoresService.remove(+id);
  }
}
