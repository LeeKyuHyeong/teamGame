import { TeamType } from '../../../database/entities/team.entity';
export declare class CreateTeamDto {
    sessionId: number;
    teamName: string;
    teamType: TeamType;
}
