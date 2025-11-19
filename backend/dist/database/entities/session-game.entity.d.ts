import { Session } from './session.entity';
import { GameType } from './game-type.entity';
import { GameRound } from './game-round.entity';
export declare enum GameStatus {
    WAITING = "\uB300\uAE30",
    IN_PROGRESS = "\uC9C4\uD589\uC911",
    COMPLETED = "\uC644\uB8CC"
}
export declare class SessionGame {
    id: number;
    sessionId: number;
    gameTypeId: number;
    gameOrder: number;
    status: GameStatus;
    createdAt: Date;
    session: Session;
    gameType: GameType;
    gameRounds: GameRound[];
}
