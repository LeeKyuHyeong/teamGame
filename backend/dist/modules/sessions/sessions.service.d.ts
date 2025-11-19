import { Repository } from 'typeorm';
import { Session } from '../../database/entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
export declare class SessionsService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<Session>);
    create(createSessionDto: CreateSessionDto): Promise<Session>;
    findAll(): Promise<Session[]>;
    findOne(id: number): Promise<Session>;
    update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session>;
    remove(id: number): Promise<void>;
    getSessionWithTeams(id: number): Promise<SessionResponseDto>;
}
