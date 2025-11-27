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
exports.SessionGame = exports.GameStatus = void 0;
const typeorm_1 = require("typeorm");
const session_entity_1 = require("./session.entity");
const game_type_entity_1 = require("./game-type.entity");
const game_round_entity_1 = require("./game-round.entity");
var GameStatus;
(function (GameStatus) {
    GameStatus["WAITING"] = "\uB300\uAE30";
    GameStatus["IN_PROGRESS"] = "\uC9C4\uD589\uC911";
    GameStatus["COMPLETED"] = "\uC644\uB8CC";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
let SessionGame = class SessionGame {
    id;
    sessionId;
    gameTypeId;
    gameOrder;
    status;
    createdAt;
    session;
    gameType;
    gameRounds;
};
exports.SessionGame = SessionGame;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], SessionGame.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'session_id' }),
    __metadata("design:type", Number)
], SessionGame.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'game_type_id' }),
    __metadata("design:type", Number)
], SessionGame.prototype, "gameTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'game_order' }),
    __metadata("design:type", Number)
], SessionGame.prototype, "gameOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GameStatus,
        default: GameStatus.WAITING,
    }),
    __metadata("design:type", String)
], SessionGame.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SessionGame.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_entity_1.Session, (session) => session.sessionGames, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", session_entity_1.Session)
], SessionGame.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => game_type_entity_1.GameType, (gameType) => gameType.sessionGames),
    (0, typeorm_1.JoinColumn)({ name: 'game_type_id' }),
    __metadata("design:type", game_type_entity_1.GameType)
], SessionGame.prototype, "gameType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => game_round_entity_1.GameRound, (gameRound) => gameRound.sessionGame),
    __metadata("design:type", Array)
], SessionGame.prototype, "gameRounds", void 0);
exports.SessionGame = SessionGame = __decorate([
    (0, typeorm_1.Entity)('session_games')
], SessionGame);
//# sourceMappingURL=session-game.entity.js.map