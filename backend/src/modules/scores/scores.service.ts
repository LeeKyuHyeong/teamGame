import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoundScore } from '../../database/entities/round-score.entity';
import { Team } from '../../database/entities/team.entity';
import { AssignScoreDto } from './dto/assign-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(RoundScore)
    private readonly scoreRepository: Repository<RoundScore>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  // 점수 부여
  async assignScore(assignScoreDto: AssignScoreDto): Promise<RoundScore> {
    // 중복 체크
    const existing = await this.scoreRepository.findOne({
      where: {
        roundId: assignScoreDto.roundId,
        teamId: assignScoreDto.teamId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Score already assigned for this round and team. Use PATCH to update.`,
      );
    }

    const score = this.scoreRepository.create(assignScoreDto);
    const savedScore = await this.scoreRepository.save(score);

    // 팀 총점 업데이트
    await this.updateTeamTotalScore(assignScoreDto.teamId);

    return savedScore;
  }

  // 라운드의 모든 점수 조회
  async findByRound(roundId: number): Promise<RoundScore[]> {
    return await this.scoreRepository.find({
      where: { roundId },
      relations: ['team'],
      order: { score: 'DESC' },
    });
  }

  // 팀의 모든 점수 조회
  async findByTeam(teamId: number): Promise<RoundScore[]> {
    return await this.scoreRepository.find({
      where: { teamId },
      relations: ['round', 'round.sessionGame', 'round.sessionGame.gameType'],
      order: { createdAt: 'DESC' },
    });
  }

  // 점수 상세 조회
  async findOne(id: number): Promise<RoundScore> {
    const score = await this.scoreRepository.findOne({
      where: { id },
      relations: ['team', 'round'],
    });

    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }

    return score;
  }

  // 점수 수정
  async update(id: number, updateScoreDto: UpdateScoreDto): Promise<RoundScore> {
    const score = await this.findOne(id);
    Object.assign(score, updateScoreDto);
    const updated = await this.scoreRepository.save(score);

    // 팀 총점 업데이트
    await this.updateTeamTotalScore(score.teamId);

    return updated;
  }

  // 점수 삭제
  async remove(id: number): Promise<void> {
    const score = await this.findOne(id);
    const teamId = score.teamId;
    
    await this.scoreRepository.remove(score);

    // 팀 총점 업데이트
    await this.updateTeamTotalScore(teamId);
  }

  // 팀 총점 업데이트 (내부 메서드)
  private async updateTeamTotalScore(teamId: number): Promise<void> {
    const scores = await this.scoreRepository.find({
      where: { teamId },
    });

    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);

    await this.teamRepository.update(teamId, { totalScore });
  }

  // 라운드별 점수 비교 (스피드/동작 게임용)
  async compareScores(roundId: number): Promise<{
    roundId: number;
    scores: { teamId: number; teamName: string; score: number; correctCount?: number }[];
    winner?: { teamId: number; teamName: string };
  }> {
    const scores = await this.findByRound(roundId);

    if (scores.length === 0) {
      return { roundId, scores: [] };
    }

    const maxScore = Math.max(...scores.map((s) => s.score));
    const winner = scores.find((s) => s.score === maxScore);

    return {
      roundId,
      scores: scores.map((s) => ({
        teamId: s.teamId,
        teamName: s.team.teamName,
        score: s.score,
        correctCount: s.correctCount,
      })),
      winner: winner
        ? {
            teamId: winner.teamId,
            teamName: winner.team.teamName,
          }
        : undefined,
    };
  }
}
