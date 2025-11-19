import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(createTeamDto: CreateTeamDto): Promise<import("../../database/entities/team.entity").Team>;
    findAll(sessionId?: string): Promise<import("../../database/entities/team.entity").Team[]>;
    findOne(id: string): Promise<import("../../database/entities/team.entity").Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<import("../../database/entities/team.entity").Team>;
    updateTotalScore(id: string): Promise<import("../../database/entities/team.entity").Team>;
    remove(id: string): Promise<void>;
}
