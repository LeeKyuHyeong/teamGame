import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(createSessionDto: CreateSessionDto): Promise<import("../../database/entities/session.entity").Session>;
    findAll(): Promise<import("../../database/entities/session.entity").Session[]>;
    findOne(id: string): Promise<import("../../database/entities/session.entity").Session>;
    getSessionWithTeams(id: string): Promise<import("./dto/session-response.dto").SessionResponseDto>;
    update(id: string, updateSessionDto: UpdateSessionDto): Promise<import("../../database/entities/session.entity").Session>;
    remove(id: string): Promise<void>;
}
