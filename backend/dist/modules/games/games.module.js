"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const games_service_1 = require("./games.service");
const games_controller_1 = require("./games.controller");
const session_game_entity_1 = require("../../database/entities/session-game.entity");
const game_type_entity_1 = require("../../database/entities/game-type.entity");
const game_round_entity_1 = require("../../database/entities/game-round.entity");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([session_game_entity_1.SessionGame, game_type_entity_1.GameType, game_round_entity_1.GameRound])],
        controllers: [games_controller_1.GamesController],
        providers: [games_service_1.GamesService],
        exports: [games_service_1.GamesService],
    })
], GamesModule);
//# sourceMappingURL=games.module.js.map