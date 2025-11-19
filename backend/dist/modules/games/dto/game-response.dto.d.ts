import { GameStatus } from '../../../database/entities/session-game.entity';
export declare class GameResponseDto {
    id: number;
    sessionId: number;
    gameTypeId: number;
    gameOrder: number;
    status: GameStatus;
    gameType?: {
        id: number;
        gameCode: string;
        gameName: string;
        description: string;
    };
    rounds?: RoundSummaryDto[];
}
export declare class RoundSummaryDto {
    id: number;
    roundNumber: number;
    isAnswerRevealed: boolean;
    scores?: {
        teamId: number;
        teamName: string;
        score: number;
    }[];
}
