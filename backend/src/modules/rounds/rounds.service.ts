import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameRound } from '../../database/entities/game-round.entity';
import { Song } from '../../database/entities/song.entity';
import { MediaContent } from '../../database/entities/media-content.entity';
import { SpeedCategory } from '../../database/entities/speed-category.entity';
import { ActionItem } from '../../database/entities/action-item.entity';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundWithContentDto } from './dto/round-with-content.dto';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(GameRound)
    private readonly roundRepository: Repository<GameRound>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(MediaContent)
    private readonly mediaRepository: Repository<MediaContent>,
    @InjectRepository(SpeedCategory)
    private readonly speedCategoryRepository: Repository<SpeedCategory>,
    @InjectRepository(ActionItem)
    private readonly actionRepository: Repository<ActionItem>,
  ) {}

  // 라운드 생성
  async create(createRoundDto: CreateRoundDto): Promise<GameRound> {
    const round = this.roundRepository.create(createRoundDto);
    return await this.roundRepository.save(round);
  }

  // 게임의 모든 라운드 조회 (콘텐츠 포함)
  async findByGame(sessionGameId: number): Promise<any[]> {
    const rounds = await this.roundRepository.find({
      where: { sessionGameId },
      relations: ['roundScores', 'roundScores.team'],
      order: { roundNumber: 'ASC' },
    });

    // 각 라운드에 콘텐츠 추가
    const roundsWithContent = await Promise.all(
      rounds.map(async (round) => {
        let content: any = null;

        switch (round.contentType) {
          case 'SONG':
            content = await this.songRepository.findOne({
              where: { id: round.contentId },
            });
            break;
          case 'MEDIA':
            content = await this.mediaRepository.findOne({
              where: { id: round.contentId },
            });
            break;
          case 'SPEED':
            content = await this.speedCategoryRepository.findOne({
              where: { id: round.contentId },
              relations: ['items'],
            });
            break;
          case 'ACTION':
            content = await this.actionRepository.findOne({
              where: { id: round.contentId },
            });
            break;
        }

        return {
          ...round,
          content,
        };
      }),
    );

    return roundsWithContent;
  }

  // 라운드 상세 조회 (콘텐츠 포함)
  async findOneWithContent(id: number): Promise<RoundWithContentDto> {
    const round = await this.roundRepository.findOne({
      where: { id },
      relations: ['roundScores', 'roundScores.team'],
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    // 콘텐츠 조회
    let content: any = null;
    
    switch (round.contentType) {
      case 'SONG':
        content = await this.songRepository.findOne({
          where: { id: round.contentId },
        });
        break;
      case 'MEDIA':
        content = await this.mediaRepository.findOne({
          where: { id: round.contentId },
        });
        break;
      case 'SPEED':
        content = await this.speedCategoryRepository.findOne({
          where: { id: round.contentId },
          relations: ['items'],
        });
        break;
      case 'ACTION':
        content = await this.actionRepository.findOne({
          where: { id: round.contentId },
        });
        break;
    }

    // 정답이 공개되지 않은 경우 정답 정보 제거
    if (!round.isAnswerRevealed && content) {
      if (round.contentType === 'SONG') {
        content = {
          ...content,
          title: null,
          artist: null,
        };
      } else if (round.contentType === 'MEDIA') {
        content = {
          ...content,
          title: null,
        };
      }
    }

    return {
      id: round.id,
      sessionGameId: round.sessionGameId,
      roundNumber: round.roundNumber,
      contentId: round.contentId,
      contentType: round.contentType,
      isAnswerRevealed: round.isAnswerRevealed,
      content,
      scores: round.roundScores?.map((score) => ({
        teamId: score.teamId,
        teamName: score.team.teamName,
        score: score.score,
        correctCount: score.correctCount,
      })),
    };
  }

  // 정답 공개/숨김
  async revealAnswer(id: number, reveal: boolean): Promise<GameRound> {
    const round = await this.roundRepository.findOne({
      where: { id },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    round.isAnswerRevealed = reveal;
    return await this.roundRepository.save(round);
  }

  // 라운드 삭제
  async remove(id: number): Promise<void> {
    const round = await this.roundRepository.findOne({
      where: { id },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    await this.roundRepository.remove(round);
  }

  // 다음 라운드 조회
  async getNextRound(sessionGameId: number): Promise<GameRound | null> {
    const rounds = await this.roundRepository.find({
      where: { sessionGameId },
      order: { roundNumber: 'ASC' },
    });

    // 정답이 공개되지 않은 첫 번째 라운드 찾기
    const nextRound = rounds.find((round) => !round.isAnswerRevealed);
    return nextRound || null;
  }
}