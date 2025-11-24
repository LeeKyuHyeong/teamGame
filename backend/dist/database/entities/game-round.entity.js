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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRound = void 0;
const typeorm_1 = require("typeorm");
const session_game_entity_1 = require("./session-game.entity");
const round_score_entity_1 = require("./round-score.entity");
let GameRound = class GameRound {
    id;
    sessionGameId;
    roundNumber;
    contentId;
    contentType;
    teamId;
    isAnswerRevealed;
    createdAt;
    sessionGame;
    roundScores;
};
exports.GameRound = GameRound;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], GameRound.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'session_game_id' }),
    __metadata("design:type", Number)
], GameRound.prototype, "sessionGameId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'round_number' }),
    __metadata("design:type", Number)
], GameRound.prototype, "roundNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true, name: 'content_id' }),
    __metadata("design:type", Number)
], GameRound.prototype, "contentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'content_type' }),
    __metadata("design:type", String)
], GameRound.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true, name: 'team_id' }),
    __metadata("design:type", Number)
], GameRound.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_answer_revealed' }),
    __metadata("design:type", Boolean)
], GameRound.prototype, "isAnswerRevealed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GameRound.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_game_entity_1.SessionGame, (sessionGame) => sessionGame.gameRounds, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'session_game_id' }),
    __metadata("design:type", session_game_entity_1.SessionGame)
], GameRound.prototype, "sessionGame", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => round_score_entity_1.RoundScore, (roundScore) => roundScore.round),
    __metadata("design:type", Array)
], GameRound.prototype, "roundScores", void 0);
exports.GameRound = GameRound = __decorate([
    (0, typeorm_1.Entity)('game_rounds')
], GameRound);
//# sourceMappingURL=game-round.entity.js.map