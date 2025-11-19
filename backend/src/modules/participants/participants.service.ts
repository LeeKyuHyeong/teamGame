import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from '../../database/entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    const participant = this.participantRepository.create(createParticipantDto);
    return await this.participantRepository.save(participant);
  }

  async createMany(
    createParticipantDtos: CreateParticipantDto[],
  ): Promise<Participant[]> {
    const participants = this.participantRepository.create(createParticipantDtos);
    return await this.participantRepository.save(participants);
  }

  async findAll(): Promise<Participant[]> {
    return await this.participantRepository.find({
      relations: ['team'],
    });
  }

  async findByTeam(teamId: number): Promise<Participant[]> {
    return await this.participantRepository.find({
      where: { teamId },
      order: { participantName: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id },
      relations: ['team'],
    });

    if (!participant) {
      throw new NotFoundException(`Participant with ID ${id} not found`);
    }

    return participant;
  }

  async remove(id: number): Promise<void> {
    const participant = await this.findOne(id);
    await this.participantRepository.remove(participant);
  }
}
