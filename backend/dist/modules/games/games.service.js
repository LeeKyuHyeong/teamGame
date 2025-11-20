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
let GamesService = class GamesService {
    sessionGameRepository;
    gameTypeRepository;
    gameRoundRepository;
    songRepository;
    constructor(sessionGameRepository, gameTypeRepository, gameRoundRepository, songRepository) {
        this.sessionGameRepository = sessionGameRepository;
        this.gameTypeRepository = gameTypeRepository;
        this.gameRoundRepository = gameRoundRepository;
        this.songRepository = songRepository;
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
        const game = await this.findOne(id);
        if (game.status !== session_game_entity_1.GameStatus.WAITING) {
            throw new common_1.BadRequestException('Game has already started or completed');
        }
        game.status = session_game_entity_1.GameStatus.IN_PROGRESS;
        await this.sessionGameRepository.save(game);
        let contentIds = [];
        if (startGameDto.roundCount) {
            if (game.gameType.gameCode === 'SONG') {
                const allSongs = await this.songRepository.find();
                if (allSongs.length < startGameDto.roundCount) {
                    throw new common_1.BadRequestException(`Not enough songs. Requested: ${startGameDto.roundCount}, Available: ${allSongs.length}`);
                }
                const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
                contentIds = shuffled.slice(0, startGameDto.roundCount).map(song => song.id);
                console.log(`[GamesService] 랜덤 선곡: ${contentIds.length}곡`);
            }
        }
        else if (startGameDto.contentIds && startGameDto.contentIds.length > 0) {
            contentIds = startGameDto.contentIds;
        }
        if (contentIds.length > 0) {
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
            await this.gameRoundRepository.save(rounds);
            console.log(`[GamesService] ${rounds.length}개 라운드 생성 완료`);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GamesService);
//# sourceMappingURL=games.service.js.map