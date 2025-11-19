import { SessionStatus } from '../../../database/entities/session.entity';
export declare class UpdateSessionDto {
    sessionName?: string;
    sessionDate?: string;
    mcName?: string;
    status?: SessionStatus;
    totalParticipants?: number;
}
