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
exports.ScoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const round_score_entity_1 = require("../../database/entities/round-score.entity");
const team_entity_1 = require("../../database/entities/team.entity");
const participant_entity_1 = require("../../database/entities/participant.entity");
let ScoresService = class ScoresService {
    scoreRepository;
    teamRepository;
    participantRepository;
    constructor(scoreRepository, teamRepository, participantRepository) {
        this.scoreRepository = scoreRepository;
        this.teamRepository = teamRepository;
        this.participantRepository = participantRepository;
    }
    async assignScore(assignScoreDto) {
        const existing = await this.scoreRepository.findOne({
            where: {
                roundId: assignScoreDto.roundId,
                teamId: assignScoreDto.teamId,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Score already assigned for this round and team. Use PATCH to update.`);
        }
        const score = this.scoreRepository.create(assignScoreDto);
        const savedScore = await this.scoreRepository.save(score);
        await this.updateTeamTotalScore(assignScoreDto.teamId);
        if (assignScoreDto.participantId) {
            await this.updateParticipantTotalScore(assignScoreDto.participantId);
        }
        return savedScore;
    }
    async findByRound(roundId) {
        return await this.scoreRepository.find({
            where: { roundId },
            relations: ['team', 'participant'],
            order: { score: 'DESC' },
        });
    }
    async findByTeam(teamId) {
        return await this.scoreRepository.find({
            where: { teamId },
            relations: ['round', 'round.sessionGame', 'round.sessionGame.gameType', 'participant'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const score = await this.scoreRepository.findOne({
            where: { id },
            relations: ['team', 'round', 'participant'],
        });
        if (!score) {
            throw new common_1.NotFoundException(`Score with ID ${id} not found`);
        }
        return score;
    }
    async update(id, updateScoreDto) {
        const score = await this.findOne(id);
        const oldParticipantId = score.participantId;
        Object.assign(score, updateScoreDto);
        const updated = await this.scoreRepository.save(score);
        await this.updateTeamTotalScore(score.teamId);
        if (oldParticipantId) {
            await this.updateParticipantTotalScore(oldParticipantId);
        }
        if (updateScoreDto.participantId && updateScoreDto.participantId !== oldParticipantId) {
            await this.updateParticipantTotalScore(updateScoreDto.participantId);
        }
        return updated;
    }
    async remove(id) {
        const score = await this.findOne(id);
        const teamId = score.teamId;
        const participantId = score.participantId;
        await this.scoreRepository.remove(score);
        await this.updateTeamTotalScore(teamId);
        if (participantId) {
            await this.updateParticipantTotalScore(participantId);
        }
    }
    async updateTeamTotalScore(teamId) {
        const scores = await this.scoreRepository.find({
            where: { teamId },
        });
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        await this.teamRepository.update(teamId, { totalScore });
    }
    async updateParticipantTotalScore(participantId) {
        const scores = await this.scoreRepository.find({
            where: { participantId },
        });
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        await this.participantRepository.update(participantId, { totalScore });
    }
    async compareScores(roundId) {
        const scores = await this.findByRound(roundId);
        if (scores.length === 0) {
            return { roundId, scores: [] };
        }
        const maxScore = Math.max(...scores.map((s) => s.score));
        const winner = scores.find((s) => s.score === maxScore);
        return {
            roundId,
            scores: scores.map((s) => ({
                teamId: s.teamId,
                teamName: s.team.teamName,
                score: s.score,
                correctCount: s.correctCount,
            })),
            winner: winner
                ? {
                    teamId: winner.teamId,
                    teamName: winner.team.teamName,
                }
                : undefined,
        };
    }
};
exports.ScoresService = ScoresService;
exports.ScoresService = ScoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(round_score_entity_1.RoundScore)),
    __param(1, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(2, (0, typeorm_1.InjectRepository)(participant_entity_1.Participant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ScoresService);
//# sourceMappingURL=scores.service.js.map