import { SessionStatus } from '../../../database/entities/session.entity';
export declare class SessionResponseDto {
    id: number;
    sessionName: string;
    sessionDate: Date;
    mcName: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
    teams?: TeamSummaryDto[];
}
export declare class TeamSummaryDto {
    id: number;
    teamName: string;
    totalScore: number;
    participantCount: number;
}
