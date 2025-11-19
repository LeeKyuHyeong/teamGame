import { SessionStatus } from '../../../database/entities/session.entity';
export declare class SessionResponseDto {
    id: number;
    sessionName: string;
    sessionDate: Date;
    mcName: string;
    status: SessionStatus;
    totalParticipants: number;
    createdAt: Date;
    updatedAt: Date;
    teams?: TeamSummaryDto[];
}
export declare class TeamSummaryDto {
    id: number;
    teamName: string;
    teamType: string;
    totalScore: number;
    participantCount: number;
}
