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
let RoundsService = class RoundsService {
    roundRepository;
    songRepository;
    mediaRepository;
    constructor(roundRepository, songRepository, mediaRepository) {
        this.roundRepository = roundRepository;
        this.songRepository = songRepository;
        this.mediaRepository = mediaRepository;
    }
    async create(createRoundDto) {
        const round = this.roundRepository.create(createRoundDto);
        return await this.roundRepository.save(round);
    }
    async findByGame(sessionGameId) {
        console.log('[RoundsService] findByGame 호출, sessionGameId:', sessionGameId);
        const rounds = await this.roundRepository.find({
            where: { sessionGameId },
            relations: ['roundScores', 'roundScores.team'],
            order: { roundNumber: 'ASC' },
        });
        console.log('  - 조회된 라운드 수:', rounds.length);
        rounds.forEach(r => {
            console.log(`    Round ${r.roundNumber}: id=${r.id}, contentType=${r.contentType}, contentId=${r.contentId}`);
        });
        const roundsWithContent = await Promise.all(rounds.map(async (round) => {
            let content = null;
            switch (round.contentType) {
                case 'SONG':
                    content = await this.songRepository.findOne({
                        where: { id: round.contentId },
                    });
                    console.log(`    - SONG content found:`, !!content);
                    break;
                case 'MEDIA':
                    content = await this.mediaRepository.findOne({
                        where: { id: round.contentId },
                    });
                    console.log(`    - MEDIA content found:`, !!content, content ? `(id=${content.id}, title=${content.title})` : '');
                    break;
            }
            return {
                ...round,
                content,
            };
        }));
        console.log('  - 콘텐츠 포함된 라운드 수:', roundsWithContent.length);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoundsService);
//# sourceMappingURL=rounds.service.js.map