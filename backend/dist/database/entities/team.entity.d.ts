import { Session } from './session.entity';
import { Participant } from './participant.entity';
import { RoundScore } from './round-score.entity';
export declare enum TeamType {
    MALE = "\uB0A8\uC131",
    FEMALE = "\uC5EC\uC131"
}
export declare class Team {
    id: number;
    sessionId: number;
    teamName: string;
    teamType: TeamType;
    totalScore: number;
    createdAt: Date;
    session: Session;
    participants: Participant[];
    roundScores: RoundScore[];
}
