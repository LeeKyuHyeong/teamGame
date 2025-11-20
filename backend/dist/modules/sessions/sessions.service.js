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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("../../database/entities/session.entity");
let SessionsService = class SessionsService {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async create(createSessionDto) {
        const session = this.sessionRepository.create({
            ...createSessionDto,
            status: session_entity_1.SessionStatus.READY,
        });
        return await this.sessionRepository.save(session);
    }
    async findAll() {
        return await this.sessionRepository.find({
            relations: ['teams', 'teams.participants'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['teams', 'teams.participants', 'sessionGames'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        if (session.teams && session.teams.length > 0) {
            session.teams.forEach((team, index) => {
            });
        }
        else {
        }
        return session;
    }
    async update(id, updateSessionDto) {
        const session = await this.findOne(id);
        Object.assign(session, updateSessionDto);
        return await this.sessionRepository.save(session);
    }
    async remove(id) {
        const session = await this.findOne(id);
        await this.sessionRepository.remove(session);
    }
    async getSessionWithTeams(id) {
        const session = await this.sessionRepository
            .createQueryBuilder('session')
            .leftJoinAndSelect('session.teams', 'team')
            .leftJoinAndSelect('team.participants', 'participant')
            .where('session.id = :id', { id })
            .getOne();
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
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
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map