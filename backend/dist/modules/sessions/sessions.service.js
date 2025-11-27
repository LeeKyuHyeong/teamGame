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
const team_entity_1 = require("../../database/entities/team.entity");
let SessionsService = class SessionsService {
    sessionRepository;
    teamRepository;
    constructor(sessionRepository, teamRepository) {
        this.sessionRepository = sessionRepository;
        this.teamRepository = teamRepository;
    }
    async create(createSessionDto) {
        const session = this.sessionRepository.create({
            ...createSessionDto,
            status: session_entity_1.SessionStatus.READY,
        });
        const savedSession = await this.sessionRepository.save(session);
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
        return await this.findOne(savedSession.id);
    }
    async findAll() {
        return await this.sessionRepository.find({
            relations: ['teams', 'teams.participants'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        console.log(`[SessionsService] findOne 호출 - ID: ${id}`);
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['teams', 'teams.participants', 'sessionGames'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        console.log(`[SessionsService] 세션 조회 성공:`);
        console.log(`  - sessionName: ${session.sessionName}`);
        console.log(`  - teams 개수: ${session.teams?.length || 0}`);
        if (session.teams && session.teams.length > 0) {
            session.teams.forEach((team, index) => {
                console.log(`  - Team ${index}: ${team.teamName}, participants: ${team.participants?.length || 0}개`);
            });
        }
        else {
            console.log(`  ⚠️ teams가 비어있음!`);
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
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(1, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map