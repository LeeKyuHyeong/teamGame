import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionGame, GameStatus } from '../../database/entities/session-game.entity';
import { GameType } from '../../database/entities/game-type.entity';
import { GameRound } from '../../database/entities/game-round.entity';
import { Song } from '../../database/entities/song.entity';
import { MediaContent } from '../../database/entities/media-content.entity';
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
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(MediaContent)
    private readonly mediaRepository: Repository<MediaContent>,
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
    console.log('[GamesService] startGame 호출');
    console.log('  - gameId:', id);
    console.log('  - startGameDto:', startGameDto);
    
    const game = await this.findOne(id);
    console.log('  - game.gameType.gameCode:', game.gameType.gameCode);

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException('Game has already started or completed');
    }

    game.status = GameStatus.IN_PROGRESS;
    await this.sessionGameRepository.save(game);

    let contentIds: number[] = [];

    if (startGameDto.roundCount) {
      if (game.gameType.gameCode === 'SONG') {
        const allSongs = await this.songRepository.find();
        
        if (allSongs.length < startGameDto.roundCount) {
          throw new BadRequestException(
            `Not enough songs. Requested: ${startGameDto.roundCount}, Available: ${allSongs.length}`
          );
        }

        const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
        contentIds = shuffled.slice(0, startGameDto.roundCount).map(song => song.id);
        console.log('  - 선택된 노래 IDs:', contentIds);
      } else if (game.gameType.gameCode === 'MEDIA') {
        const allMedia = await this.mediaRepository.find();
        console.log('  - 전체 미디어 개수:', allMedia.length);
        console.log('  - 요청 라운드 수:', startGameDto.roundCount);
        
        if (allMedia.length < startGameDto.roundCount) {
          throw new BadRequestException(
            `Not enough media. Requested: ${startGameDto.roundCount}, Available: ${allMedia.length}`
          );
        }

        const shuffled = [...allMedia].sort(() => Math.random() - 0.5);
        contentIds = shuffled.slice(0, startGameDto.roundCount).map(media => media.id);
        console.log('  - 선택된 미디어 IDs:', contentIds);
      }
    } 
    else if (startGameDto.contentIds && startGameDto.contentIds.length > 0) {
      contentIds = startGameDto.contentIds;
    }

    console.log('  - 최종 contentIds:', contentIds);

    if (contentIds.length > 0) {
      const rounds: GameRound[] = [];
      
      for (let i = 0; i < contentIds.length; i++) {
        const round = this.gameRoundRepository.create({
          sessionGameId: game.id,
          roundNumber: i + 1,
          contentId: contentIds[i],
          contentType: game.gameType.gameCode,
          isAnswerRevealed: false,
        });
        rounds.push(round);
      }

      const savedRounds = await this.gameRoundRepository.save(rounds);
      console.log('  - 생성된 라운드 수:', savedRounds.length);
      savedRounds.forEach((r, idx) => {
        console.log(`    Round ${idx + 1}: id=${r.id}, contentId=${r.contentId}, contentType=${r.contentType}`);
      });
    } else {
      console.log('  ⚠️ contentIds가 비어있음!');
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
