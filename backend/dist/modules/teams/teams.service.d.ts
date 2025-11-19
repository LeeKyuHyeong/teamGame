import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private readonly teamRepository;
    constructor(teamRepository: Repository<Team>);
    create(createTeamDto: CreateTeamDto): Promise<Team>;
    findAll(): Promise<Team[]>;
    findBySession(sessionId: number): Promise<Team[]>;
    findOne(id: number): Promise<Team>;
    update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team>;
    remove(id: number): Promise<void>;
    updateTotalScore(teamId: number): Promise<Team>;
}
