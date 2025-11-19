import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(createTeamDto);
    return await this.teamRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ['participants', 'session'],
    });
  }

  async findBySession(sessionId: number): Promise<Team[]> {
    return await this.teamRepository.find({
      where: { sessionId },
      relations: ['participants'],
      order: { teamName: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['participants', 'session', 'roundScores'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return await this.teamRepository.save(team);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  async updateTotalScore(teamId: number): Promise<Team> {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.roundScores', 'roundScore')
      .where('team.id = :teamId', { teamId })
      .getOne();

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const totalScore = team.roundScores?.reduce(
      (sum, score) => sum + score.score,
      0,
    ) || 0;

    team.totalScore = totalScore;
    return await this.teamRepository.save(team);
  }
}
