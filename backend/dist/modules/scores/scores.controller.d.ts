import { ScoresService } from './scores.service';
import { AssignScoreDto } from './dto/assign-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
export declare class ScoresController {
    private readonly scoresService;
    constructor(scoresService: ScoresService);
    assignScore(assignScoreDto: AssignScoreDto): Promise<import("../../database/entities/round-score.entity").RoundScore>;
    find(roundId?: string, teamId?: string): never[] | Promise<import("../../database/entities/round-score.entity").RoundScore[]>;
    findOne(id: string): Promise<import("../../database/entities/round-score.entity").RoundScore>;
    compareScores(roundId: string): Promise<{
        roundId: number;
        scores: {
            teamId: number;
            teamName: string;
            score: number;
            correctCount?: number;
        }[];
        winner?: {
            teamId: number;
            teamName: string;
        };
    }>;
    update(id: string, updateScoreDto: UpdateScoreDto): Promise<import("../../database/entities/round-score.entity").RoundScore>;
    remove(id: string): Promise<void>;
}
