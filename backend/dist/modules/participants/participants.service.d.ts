import { Repository } from 'typeorm';
import { Participant } from '../../database/entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
export declare class ParticipantsService {
    private readonly participantRepository;
    constructor(participantRepository: Repository<Participant>);
    create(createParticipantDto: CreateParticipantDto): Promise<Participant>;
    createMany(createParticipantDtos: CreateParticipantDto[]): Promise<Participant[]>;
    findAll(): Promise<Participant[]>;
    findByTeam(teamId: number): Promise<Participant[]>;
    findOne(id: number): Promise<Participant>;
    remove(id: number): Promise<void>;
}
