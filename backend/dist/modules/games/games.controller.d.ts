import { GamesService } from './games.service';
import { CreateSessionGameDto } from './dto/create-session-game.dto';
import { StartGameDto } from './dto/start-game.dto';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    getGameTypes(): Promise<import("../../database/entities/game-type.entity").GameType[]>;
    findBySession(sessionId: string): Promise<import("../../database/entities/session-game.entity").SessionGame[]>;
    findOne(id: string): Promise<import("../../database/entities/session-game.entity").SessionGame>;
    addGameToSession(createSessionGameDto: CreateSessionGameDto): Promise<import("../../database/entities/session-game.entity").SessionGame>;
    startGame(id: string, startGameDto: StartGameDto): Promise<import("../../database/entities/session-game.entity").SessionGame>;
    completeGame(id: string): Promise<import("../../database/entities/session-game.entity").SessionGame>;
    remove(id: string): Promise<void>;
}
