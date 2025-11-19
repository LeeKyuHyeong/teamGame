import { Repository } from 'typeorm';
import { SessionGame } from '../../database/entities/session-game.entity';
import { GameType } from '../../database/entities/game-type.entity';
import { GameRound } from '../../database/entities/game-round.entity';
import { CreateSessionGameDto } from './dto/create-session-game.dto';
import { StartGameDto } from './dto/start-game.dto';
export declare class GamesService {
    private readonly sessionGameRepository;
    private readonly gameTypeRepository;
    private readonly gameRoundRepository;
    constructor(sessionGameRepository: Repository<SessionGame>, gameTypeRepository: Repository<GameType>, gameRoundRepository: Repository<GameRound>);
    addGameToSession(createDto: CreateSessionGameDto): Promise<SessionGame>;
    findBySession(sessionId: number): Promise<SessionGame[]>;
    findOne(id: number): Promise<SessionGame>;
    startGame(id: number, startGameDto: StartGameDto): Promise<SessionGame>;
    completeGame(id: number): Promise<SessionGame>;
    remove(id: number): Promise<void>;
    getGameTypes(): Promise<GameType[]>;
}
