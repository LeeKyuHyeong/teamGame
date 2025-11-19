"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const session_entity_1 = require("./entities/session.entity");
const team_entity_1 = require("./entities/team.entity");
const participant_entity_1 = require("./entities/participant.entity");
const game_type_entity_1 = require("./entities/game-type.entity");
const session_game_entity_1 = require("./entities/session-game.entity");
const game_round_entity_1 = require("./entities/game-round.entity");
const round_score_entity_1 = require("./entities/round-score.entity");
const song_entity_1 = require("./entities/song.entity");
const media_content_entity_1 = require("./entities/media-content.entity");
const speed_category_entity_1 = require("./entities/speed-category.entity");
const speed_item_entity_1 = require("./entities/speed-item.entity");
const action_item_entity_1 = require("./entities/action-item.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [
                        session_entity_1.Session,
                        team_entity_1.Team,
                        participant_entity_1.Participant,
                        game_type_entity_1.GameType,
                        session_game_entity_1.SessionGame,
                        game_round_entity_1.GameRound,
                        round_score_entity_1.RoundScore,
                        song_entity_1.Song,
                        media_content_entity_1.MediaContent,
                        speed_category_entity_1.SpeedCategory,
                        speed_item_entity_1.SpeedItem,
                        action_item_entity_1.ActionItem,
                    ],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    timezone: '+09:00',
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map