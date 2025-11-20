import { GameRound } from './game-round.entity';
import { Team } from './team.entity';
import { Participant } from './participant.entity';
export declare class RoundScore {
    id: number;
    roundId: number;
    teamId: number;
    participantId: number;
    score: number;
    correctCount: number;
    createdAt: Date;
    round: GameRound;
    team: Team;
    participant: Participant;
}
