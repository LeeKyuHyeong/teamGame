import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
export declare class ParticipantsController {
    private readonly participantsService;
    constructor(participantsService: ParticipantsService);
    create(createParticipantDto: CreateParticipantDto): Promise<import("../../database/entities/participant.entity").Participant>;
    createMany(createParticipantDtos: CreateParticipantDto[]): Promise<import("../../database/entities/participant.entity").Participant[]>;
    findAll(teamId?: string): Promise<import("../../database/entities/participant.entity").Participant[]>;
    findOne(id: string): Promise<import("../../database/entities/participant.entity").Participant>;
    remove(id: string): Promise<void>;
}
