import { GameRound } from './game-round.entity';
import { Team } from './team.entity';
export declare class RoundScore {
    id: number;
    roundId: number;
    teamId: number;
    score: number;
    correctCount: number;
    createdAt: Date;
    round: GameRound;
    team: Team;
}
