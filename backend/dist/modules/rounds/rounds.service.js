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
exports.RoundsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_round_entity_1 = require("../../database/entities/game-round.entity");
const song_entity_1 = require("../../database/entities/song.entity");
const media_content_entity_1 = require("../../database/entities/media-content.entity");
const speed_category_entity_1 = require("../../database/entities/speed-category.entity");
const action_item_entity_1 = require("../../database/entities/action-item.entity");
let RoundsService = class RoundsService {
    roundRepository;
    songRepository;
    mediaRepository;
    speedCategoryRepository;
    actionRepository;
    constructor(roundRepository, songRepository, mediaRepository, speedCategoryRepository, actionRepository) {
        this.roundRepository = roundRepository;
        this.songRepository = songRepository;
        this.mediaRepository = mediaRepository;
        this.speedCategoryRepository = speedCategoryRepository;
        this.actionRepository = actionRepository;
    }
    async create(createRoundDto) {
        const round = this.roundRepository.create(createRoundDto);
        return await this.roundRepository.save(round);
    }
    async findByGame(sessionGameId) {
        const rounds = await this.roundRepository.find({
            where: { sessionGameId },
            relations: ['roundScores', 'roundScores.team'],
            order: { roundNumber: 'ASC' },
        });
        const roundsWithContent = await Promise.all(rounds.map(async (round) => {
            let content = null;
            switch (round.contentType) {
                case 'SONG':
                    content = await this.songRepository.findOne({
                        where: { id: round.contentId },
                    });
                    break;
                case 'MEDIA':
                    content = await this.mediaRepository.findOne({
                        where: { id: round.contentId },
                    });
                    break;
                case 'SPEED':
                    content = await this.speedCategoryRepository.findOne({
                        where: { id: round.contentId },
                        relations: ['items'],
                    });
                    break;
                case 'ACTION':
                    content = await this.actionRepository.findOne({
                        where: { id: round.contentId },
                    });
                    break;
            }
            return {
                ...round,
                content,
            };
        }));
        return roundsWithContent;
    }
    async findOneWithContent(id) {
        const round = await this.roundRepository.findOne({
            where: { id },
            relations: ['roundScores', 'roundScores.team'],
        });
        if (!round) {
            throw new common_1.NotFoundException(`Round with ID ${id} not found`);
        }
        let content = null;
        switch (round.contentType) {
            case 'SONG':
                content = await this.songRepository.findOne({
                    where: { id: round.contentId },
                });
                break;
            case 'MEDIA':
                content = await this.mediaRepository.findOne({
                    where: { id: round.contentId },
                });
                break;
            case 'SPEED':
                content = await this.speedCategoryRepository.findOne({
                    where: { id: round.contentId },
                    relations: ['items'],
                });
                break;
            case 'ACTION':
                content = await this.actionRepository.findOne({
                    where: { id: round.contentId },
                });
                break;
        }
        if (!round.isAnswerRevealed && content) {
            if (round.contentType === 'SONG') {
                content = {
                    ...content,
                    title: null,
                    artist: null,
                };
            }
            else if (round.contentType === 'MEDIA') {
                content = {
                    ...content,
                    title: null,
                };
            }
        }
        return {
            id: round.id,
            sessionGameId: round.sessionGameId,
            roundNumber: round.roundNumber,
            contentId: round.contentId,
            contentType: round.contentType,
            isAnswerRevealed: round.isAnswerRevealed,
            content,
            scores: round.roundScores?.map((score) => ({
                teamId: score.teamId,
                teamName: score.team.teamName,
                score: score.score,
                correctCount: score.correctCount,
            })),
        };
    }
    async revealAnswer(id, reveal) {
        const round = await this.roundRepository.findOne({
            where: { id },
        });
        if (!round) {
            throw new common_1.NotFoundException(`Round with ID ${id} not found`);
        }
        round.isAnswerRevealed = reveal;
        return await this.roundRepository.save(round);
    }
    async remove(id) {
        const round = await this.roundRepository.findOne({
            where: { id },
        });
        if (!round) {
            throw new common_1.NotFoundException(`Round with ID ${id} not found`);
        }
        await this.roundRepository.remove(round);
    }
    async getNextRound(sessionGameId) {
        const rounds = await this.roundRepository.find({
            where: { sessionGameId },
            order: { roundNumber: 'ASC' },
        });
        const nextRound = rounds.find((round) => !round.isAnswerRevealed);
        return nextRound || null;
    }
};
exports.RoundsService = RoundsService;
exports.RoundsService = RoundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_round_entity_1.GameRound)),
    __param(1, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __param(2, (0, typeorm_1.InjectRepository)(media_content_entity_1.MediaContent)),
    __param(3, (0, typeorm_1.InjectRepository)(speed_category_entity_1.SpeedCategory)),
    __param(4, (0, typeorm_1.InjectRepository)(action_item_entity_1.ActionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoundsService);
//# sourceMappingURL=rounds.service.js.map