import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionGame, GameStatus } from '../../database/entities/session-game.entity';
import { GameType } from '../../database/entities/game-type.entity';
import { GameRound } from '../../database/entities/game-round.entity';
import { CreateSessionGameDto } from './dto/create-session-game.dto';
import { StartGameDto } from './dto/start-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(SessionGame)
    private readonly sessionGameRepository: Repository<SessionGame>,
    @InjectRepository(GameType)
    private readonly gameTypeRepository: Repository<GameType>,
    @InjectRepository(GameRound)
    private readonly gameRoundRepository: Repository<GameRound>,
  ) {}

  // 게임 추가 (세션에 게임 등록)
  async addGameToSession(createDto: CreateSessionGameDto): Promise<SessionGame> {
    const gameType = await this.gameTypeRepository.findOne({
      where: { gameCode: createDto.gameCode },
    });

    if (!gameType) {
      throw new NotFoundException(`Game type ${createDto.gameCode} not found`);
    }

    const sessionGame = this.sessionGameRepository.create({
      sessionId: createDto.sessionId,
      gameTypeId: gameType.id,
      gameOrder: createDto.gameOrder,
      status: GameStatus.WAITING,
    });

    return await this.sessionGameRepository.save(sessionGame);
  }

  // 세션의 모든 게임 조회
  async findBySession(sessionId: number): Promise<SessionGame[]> {
    return await this.sessionGameRepository.find({
      where: { sessionId },
      relations: ['gameType', 'gameRounds'],
      order: { gameOrder: 'ASC' },
    });
  }

  // 게임 상세 조회
  async findOne(id: number): Promise<SessionGame> {
    const game = await this.sessionGameRepository.findOne({
      where: { id },
      relations: ['gameType', 'gameRounds', 'gameRounds.roundScores', 'gameRounds.roundScores.team'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

  // 게임 시작
  async startGame(id: number, startGameDto: StartGameDto): Promise<SessionGame> {
    const game = await this.findOne(id);

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException('Game has already started or completed');
    }

    // 게임 상태를 진행중으로 변경
    game.status = GameStatus.IN_PROGRESS;
    await this.sessionGameRepository.save(game);

    // 콘텐츠 ID가 제공된 경우 라운드 생성
    if (startGameDto.contentIds && startGameDto.contentIds.length > 0) {
      const rounds: GameRound[] = [];
      
      for (let i = 0; i < startGameDto.contentIds.length; i++) {
        const round = this.gameRoundRepository.create({
          sessionGameId: game.id,
          roundNumber: i + 1,
          contentId: startGameDto.contentIds[i],
          contentType: game.gameType.gameCode,
          isAnswerRevealed: false,
        });
        rounds.push(round);
      }

      await this.gameRoundRepository.save(rounds);
    }

    return await this.findOne(id);
  }

  // 게임 완료
  async completeGame(id: number): Promise<SessionGame> {
    const game = await this.findOne(id);

    if (game.status === GameStatus.COMPLETED) {
      throw new BadRequestException('Game is already completed');
    }

    game.status = GameStatus.COMPLETED;
    return await this.sessionGameRepository.save(game);
  }

  // 게임 삭제
  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    await this.sessionGameRepository.remove(game);
  }

  // 게임 타입 목록 조회
  async getGameTypes(): Promise<GameType[]> {
    return await this.gameTypeRepository.find();
  }
}
