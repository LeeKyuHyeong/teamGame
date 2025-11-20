import { Team } from './team.entity';
import { RoundScore } from './round-score.entity';
export declare class Participant {
    id: number;
    teamId: number;
    participantName: string;
    isMc: boolean;
    totalScore: number;
    createdAt: Date;
    team: Team;
    roundScores: RoundScore[];
}
