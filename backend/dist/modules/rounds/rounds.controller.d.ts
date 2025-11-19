import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { RevealAnswerDto } from './dto/reveal-answer.dto';
export declare class RoundsController {
    private readonly roundsService;
    constructor(roundsService: RoundsService);
    create(createRoundDto: CreateRoundDto): Promise<import("../../database/entities/game-round.entity").GameRound>;
    findByGame(sessionGameId: string): Promise<any[]>;
    findOne(id: string): Promise<import("./dto/round-with-content.dto").RoundWithContentDto>;
    getNextRound(sessionGameId: string): Promise<import("../../database/entities/game-round.entity").GameRound | null>;
    revealAnswer(id: string, revealAnswerDto: RevealAnswerDto): Promise<import("../../database/entities/game-round.entity").GameRound>;
    remove(id: string): Promise<void>;
}
