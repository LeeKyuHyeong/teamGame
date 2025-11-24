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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_game_entity_1 = require("../../database/entities/session-game.entity");
const game_type_entity_1 = require("../../database/entities/game-type.entity");
const game_round_entity_1 = require("../../database/entities/game-round.entity");
const song_entity_1 = require("../../database/entities/song.entity");
const media_content_entity_1 = require("../../database/entities/media-content.entity");
const speed_category_entity_1 = require("../../database/entities/speed-category.entity");
let GamesService = class GamesService {
    sessionGameRepository;
    gameTypeRepository;
    gameRoundRepository;
    songRepository;
    mediaRepository;
    speedCategoryRepository;
    constructor(sessionGameRepository, gameTypeRepository, gameRoundRepository, songRepository, mediaRepository, speedCategoryRepository) {
        this.sessionGameRepository = sessionGameRepository;
        this.gameTypeRepository = gameTypeRepository;
        this.gameRoundRepository = gameRoundRepository;
        this.songRepository = songRepository;
        this.mediaRepository = mediaRepository;
        this.speedCategoryRepository = speedCategoryRepository;
    }
    async addGameToSession(createDto) {
        const gameType = await this.gameTypeRepository.findOne({
            where: { gameCode: createDto.gameCode },
        });
        if (!gameType) {
            throw new common_1.NotFoundException(`Game type ${createDto.gameCode} not found`);
        }
        const sessionGame = this.sessionGameRepository.create({
            sessionId: createDto.sessionId,
            gameTypeId: gameType.id,
            gameOrder: createDto.gameOrder,
            status: session_game_entity_1.GameStatus.WAITING,
        });
        return await this.sessionGameRepository.save(sessionGame);
    }
    async findBySession(sessionId) {
        return await this.sessionGameRepository.find({
            where: { sessionId },
            relations: ['gameType', 'gameRounds'],
            order: { gameOrder: 'ASC' },
        });
    }
    async findOne(id) {
        const game = await this.sessionGameRepository.findOne({
            where: { id },
            relations: ['gameType', 'gameRounds', 'gameRounds.roundScores', 'gameRounds.roundScores.team'],
        });
        if (!game) {
            throw new common_1.NotFoundException(`Game with ID ${id} not found`);
        }
        return game;
    }
    async startGame(id, startGameDto) {
        console.log('[GamesService] startGame 호출');
        console.log('  - gameId:', id);
        console.log('  - startGameDto:', startGameDto);
        const game = await this.findOne(id);
        console.log('  - game.gameType.gameCode:', game.gameType.gameCode);
        if (game.status !== session_game_entity_1.GameStatus.WAITING) {
            throw new common_1.BadRequestException('Game has already started or completed');
        }
        game.status = session_game_entity_1.GameStatus.IN_PROGRESS;
        await this.sessionGameRepository.save(game);
        let contentIds = [];
        const teamRounds = [];
        if (startGameDto.teamConfigs && startGameDto.teamConfigs.length > 0) {
            console.log('  - 스피드 게임 팀별 설정:', startGameDto.teamConfigs);
            for (const config of startGameDto.teamConfigs) {
                const category = await this.speedCategoryRepository.findOne({
                    where: { id: config.categoryId },
                    relations: ['items'],
                });
                if (!category || !category.items) {
                    throw new common_1.BadRequestException(`Category ${config.categoryId} not found or has no items`);
                }
                if (category.items.length < config.roundCount) {
                    throw new common_1.BadRequestException(`Not enough items in category. Requested: ${config.roundCount}, Available: ${category.items.length}`);
                }
                for (let i = 0; i < config.roundCount; i++) {
                    teamRounds.push({
                        teamId: config.teamId,
                        contentId: config.categoryId,
                    });
                }
            }
            console.log('  - 생성할 팀별 라운드:', teamRounds);
        }
        else if (startGameDto.roundCount) {
            if (game.gameType.gameCode === 'SONG') {
                const allSongs = await this.songRepository.find();
                if (allSongs.length < startGameDto.roundCount) {
                    throw new common_1.BadRequestException(`Not enough songs. Requested: ${startGameDto.roundCount}, Available: ${allSongs.length}`);
                }
                const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
                contentIds = shuffled.slice(0, startGameDto.roundCount).map(song => song.id);
                console.log('  - 선택된 노래 IDs:', contentIds);
            }
            else if (game.gameType.gameCode === 'MEDIA') {
                const allMedia = await this.mediaRepository.find();
                console.log('  - 전체 미디어 개수:', allMedia.length);
                console.log('  - 요청 라운드 수:', startGameDto.roundCount);
                if (allMedia.length < startGameDto.roundCount) {
                    throw new common_1.BadRequestException(`Not enough media. Requested: ${startGameDto.roundCount}, Available: ${allMedia.length}`);
                }
                const shuffled = [...allMedia].sort(() => Math.random() - 0.5);
                contentIds = shuffled.slice(0, startGameDto.roundCount).map(media => media.id);
                console.log('  - 선택된 미디어 IDs:', contentIds);
            }
        }
        else if (startGameDto.contentIds && startGameDto.contentIds.length > 0) {
            contentIds = startGameDto.contentIds;
        }
        console.log('  - 최종 contentIds:', contentIds);
        console.log('  - teamRounds:', teamRounds);
        if (teamRounds.length > 0) {
            const rounds = [];
            teamRounds.forEach((tr, index) => {
                const round = this.gameRoundRepository.create({
                    sessionGameId: game.id,
                    roundNumber: index + 1,
                    contentId: tr.contentId,
                    contentType: game.gameType.gameCode,
                    isAnswerRevealed: false,
                    teamId: tr.teamId,
                });
                rounds.push(round);
            });
            const savedRounds = await this.gameRoundRepository.save(rounds);
            console.log('  - 생성된 팀별 라운드 수:', savedRounds.length);
        }
        else if (contentIds.length > 0) {
            const rounds = [];
            for (let i = 0; i < contentIds.length; i++) {
                const round = this.gameRoundRepository.create({
                    sessionGameId: game.id,
                    roundNumber: i + 1,
                    contentId: contentIds[i],
                    contentType: game.gameType.gameCode,
                    isAnswerRevealed: false,
                });
                rounds.push(round);
            }
            const savedRounds = await this.gameRoundRepository.save(rounds);
            console.log('  - 생성된 라운드 수:', savedRounds.length);
            savedRounds.forEach((r, idx) => {
                console.log(`    Round ${idx + 1}: id=${r.id}, contentId=${r.contentId}, contentType=${r.contentType}`);
            });
        }
        else {
            console.log('  ⚠️ contentIds가 비어있음!');
        }
        return await this.findOne(id);
    }
    async completeGame(id) {
        const game = await this.findOne(id);
        if (game.status === session_game_entity_1.GameStatus.COMPLETED) {
            throw new common_1.BadRequestException('Game is already completed');
        }
        game.status = session_game_entity_1.GameStatus.COMPLETED;
        return await this.sessionGameRepository.save(game);
    }
    async remove(id) {
        const game = await this.findOne(id);
        await this.sessionGameRepository.remove(game);
    }
    async getGameTypes() {
        return await this.gameTypeRepository.find();
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_game_entity_1.SessionGame)),
    __param(1, (0, typeorm_1.InjectRepository)(game_type_entity_1.GameType)),
    __param(2, (0, typeorm_1.InjectRepository)(game_round_entity_1.GameRound)),
    __param(3, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __param(4, (0, typeorm_1.InjectRepository)(media_content_entity_1.MediaContent)),
    __param(5, (0, typeorm_1.InjectRepository)(speed_category_entity_1.SpeedCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
//# sourceMappingURL=games.service.js.map