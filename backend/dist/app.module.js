"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const teams_module_1 = require("./modules/teams/teams.module");
const participants_module_1 = require("./modules/participants/participants.module");
const games_module_1 = require("./modules/games/games.module");
const rounds_module_1 = require("./modules/rounds/rounds.module");
const scores_module_1 = require("./modules/scores/scores.module");
const songs_module_1 = require("./modules/songs/songs.module");
const media_module_1 = require("./modules/media/media.module");
const speed_module_1 = require("./modules/speed/speed.module");
const actions_module_1 = require("./modules/actions/actions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
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
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    timezone: '+09:00',
                }),
            }),
            sessions_module_1.SessionsModule,
            teams_module_1.TeamsModule,
            participants_module_1.ParticipantsModule,
            games_module_1.GamesModule,
            rounds_module_1.RoundsModule,
            scores_module_1.ScoresModule,
            songs_module_1.SongsModule,
            media_module_1.MediaModule,
            speed_module_1.SpeedModule,
            actions_module_1.ActionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map