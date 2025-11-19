import { Team } from './team.entity';
export declare class Participant {
    id: number;
    teamId: number;
    participantName: string;
    isMc: boolean;
    createdAt: Date;
    team: Team;
}
