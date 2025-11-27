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
exports.GameType = void 0;
const typeorm_1 = require("typeorm");
const session_game_entity_1 = require("./session-game.entity");
let GameType = class GameType {
    id;
    gameCode;
    gameName;
    description;
    createdAt;
    sessionGames;
};
exports.GameType = GameType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], GameType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, name: 'game_code' }),
    __metadata("design:type", String)
], GameType.prototype, "gameCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'game_name' }),
    __metadata("design:type", String)
], GameType.prototype, "gameName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GameType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GameType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => session_game_entity_1.SessionGame, (sessionGame) => sessionGame.gameType),
    __metadata("design:type", Array)
], GameType.prototype, "sessionGames", void 0);
exports.GameType = GameType = __decorate([
    (0, typeorm_1.Entity)('game_types')
], GameType);
//# sourceMappingURL=game-type.entity.js.map