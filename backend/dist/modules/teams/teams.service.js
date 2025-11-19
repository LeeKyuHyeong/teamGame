"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("../../database/entities/team.entity");
let TeamsService = class TeamsService {
    teamRepository;
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async create(createTeamDto) {
        const team = this.teamRepository.create(createTeamDto);
        return await this.teamRepository.save(team);
    }
    async findAll() {
        return await this.teamRepository.find({
            relations: ['participants', 'session'],
        });
    }
    async findBySession(sessionId) {
        return await this.teamRepository.find({
            where: { sessionId },
            relations: ['participants'],
            order: { teamName: 'ASC' },
        });
    }
    async findOne(id) {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['participants', 'session', 'roundScores'],
        });
        if (!team) {
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        }
        return team;
    }
    async update(id, updateTeamDto) {
        const team = await this.findOne(id);
        Object.assign(team, updateTeamDto);
        return await this.teamRepository.save(team);
    }
    async remove(id) {
        const team = await this.findOne(id);
        await this.teamRepository.remove(team);
    }
    async updateTotalScore(teamId) {
        const team = await this.teamRepository
            .createQueryBuilder('team')
            .leftJoinAndSelect('team.roundScores', 'roundScore')
            .where('team.id = :teamId', { teamId })
            .getOne();
        if (!team) {
            throw new common_1.NotFoundException(`Team with ID ${teamId} not found`);
        }
        const totalScore = team.roundScores?.reduce((sum, score) => sum + score.score, 0) || 0;
        team.totalScore = totalScore;
        return await this.teamRepository.save(team);
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TeamsService);
//# sourceMappingURL=teams.service.js.map