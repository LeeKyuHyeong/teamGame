import { SessionGame } from './session-game.entity';
import { RoundScore } from './round-score.entity';
export declare class GameRound {
    id: number;
    sessionGameId: number;
    roundNumber: number;
    contentId: number;
    contentType: string;
    isAnswerRevealed: boolean;
    createdAt: Date;
    sessionGame: SessionGame;
    roundScores: RoundScore[];
}
