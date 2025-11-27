import { Team } from './team.entity';
import { SessionGame } from './session-game.entity';
export declare enum SessionStatus {
    READY = "\uC900\uBE44\uC911",
    IN_PROGRESS = "\uC9C4\uD589\uC911",
    COMPLETED = "\uC644\uB8CC"
}
export declare class Session {
    id: number;
    sessionName: string;
    sessionDate: Date;
    mcName: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
    teams: Team[];
    sessionGames: SessionGame[];
}
