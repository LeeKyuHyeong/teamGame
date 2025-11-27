"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rounds_service_1 = require("./rounds.service");
const rounds_controller_1 = require("./rounds.controller");
const game_round_entity_1 = require("../../database/entities/game-round.entity");
const song_entity_1 = require("../../database/entities/song.entity");
const media_content_entity_1 = require("../../database/entities/media-content.entity");
let RoundsModule = class RoundsModule {
};
exports.RoundsModule = RoundsModule;
exports.RoundsModule = RoundsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                game_round_entity_1.GameRound,
                song_entity_1.Song,
                media_content_entity_1.MediaContent,
            ]),
        ],
        controllers: [rounds_controller_1.RoundsController],
        providers: [rounds_service_1.RoundsService],
        exports: [rounds_service_1.RoundsService],
    })
], RoundsModule);
//# sourceMappingURL=rounds.module.js.map