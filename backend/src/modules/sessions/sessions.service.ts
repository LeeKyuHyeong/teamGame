import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from '../../database/entities/session.entity';
import { Team } from '../../database/entities/team.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create({
      ...createSessionDto,
      status: SessionStatus.READY,
    });
    const savedSession = await this.sessionRepository.save(session);

    // 팀 자동 생성
    const teamAName = createSessionDto.teamAName || 'A팀';
    const teamBName = createSessionDto.teamBName || 'B팀';

    const teamA = this.teamRepository.create({
      sessionId: savedSession.id,
      teamName: teamAName,
      totalScore: 0,
    });

    const teamB = this.teamRepository.create({
      sessionId: savedSession.id,
      teamName: teamBName,
      totalScore: 0,
    });

    await this.teamRepository.save([teamA, teamB]);

    // 팀 정보 포함하여 반환
    return await this.findOne(savedSession.id);
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.find({
      relations: ['teams', 'teams.participants'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Session> {
    console.log(`[SessionsService] findOne 호출 - ID: ${id}`);
    
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['teams', 'teams.participants', 'sessionGames'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    console.log(`[SessionsService] 세션 조회 성공:`);
    console.log(`  - sessionName: ${session.sessionName}`);
    console.log(`  - teams 개수: ${session.teams?.length || 0}`);
    if (session.teams && session.teams.length > 0) {
      session.teams.forEach((team, index) => {
        console.log(`  - Team ${index}: ${team.teamName}, participants: ${team.participants?.length || 0}개`);
      });
    } else {
      console.log(`  ⚠️ teams가 비어있음!`);
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
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      teams: session.teams?.map((team) => ({
        id: team.id,
        teamName: team.teamName,
        totalScore: team.totalScore,
        participantCount: team.participants?.length || 0,
      })),
    };
  }
}
