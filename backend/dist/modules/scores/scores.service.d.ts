import { Repository } from 'typeorm';
import { RoundScore } from '../../database/entities/round-score.entity';
import { Team } from '../../database/entities/team.entity';
import { Participant } from '../../database/entities/participant.entity';
import { AssignScoreDto } from './dto/assign-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
export declare class ScoresService {
    private readonly scoreRepository;
    private readonly teamRepository;
    private readonly participantRepository;
    constructor(scoreRepository: Repository<RoundScore>, teamRepository: Repository<Team>, participantRepository: Repository<Participant>);
    assignScore(assignScoreDto: AssignScoreDto): Promise<RoundScore>;
    findByRound(roundId: number): Promise<RoundScore[]>;
    findByTeam(teamId: number): Promise<RoundScore[]>;
    findOne(id: number): Promise<RoundScore>;
    update(id: number, updateScoreDto: UpdateScoreDto): Promise<RoundScore>;
    remove(id: number): Promise<void>;
    private updateTeamTotalScore;
    private updateParticipantTotalScore;
    compareScores(roundId: number): Promise<{
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
}
