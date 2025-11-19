import { SessionGame } from './session-game.entity';
export declare class GameType {
    id: number;
    gameCode: string;
    gameName: string;
    description: string;
    createdAt: Date;
    sessionGames: SessionGame[];
}
