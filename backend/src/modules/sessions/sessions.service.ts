import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from '../../database/entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create({
      ...createSessionDto,
      status: SessionStatus.READY,
    });
    return await this.sessionRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.find({
      relations: ['teams', 'teams.participants'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Session> {
    
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['teams', 'teams.participants', 'sessionGames'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    if (session.teams && session.teams.length > 0) {
      session.teams.forEach((team, index) => {        
      });
    } else {
      // console.log(`  ⚠️ teams가 비어있음!`);
    }

    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    return await this.sessionRepository.save(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }

  async getSessionWithTeams(id: number): Promise<SessionResponseDto> {
    const session = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.teams', 'team')
      .leftJoinAndSelect('team.participants', 'participant')
      .where('session.id = :id', { id })
      .getOne();

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return {
      id: session.id,
      sessionName: session.sessionName,
      sessionDate: session.sessionDate,
      mcName: session.mcName,
      status: session.status,
      totalParticipants: session.totalParticipants,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      teams: session.teams?.map((team) => ({
        id: team.id,
        teamName: team.teamName,
        teamType: team.teamType,
        totalScore: team.totalScore,
        participantCount: team.participants?.length || 0,
      })),
    };
  }
}
