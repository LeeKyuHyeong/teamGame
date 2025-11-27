import { Session } from './session.entity';
import { Participant } from './participant.entity';
import { RoundScore } from './round-score.entity';
export declare class Team {
    id: number;
    sessionId: number;
    teamName: string;
    totalScore: number;
    createdAt: Date;
    session: Session;
    participants: Participant[];
    roundScores: RoundScore[];
}
