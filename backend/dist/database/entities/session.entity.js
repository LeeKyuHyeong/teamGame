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
exports.Session = exports.SessionStatus = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const session_game_entity_1 = require("./session-game.entity");
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["READY"] = "\uC900\uBE44\uC911";
    SessionStatus["IN_PROGRESS"] = "\uC9C4\uD589\uC911";
    SessionStatus["COMPLETED"] = "\uC644\uB8CC";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
let Session = class Session {
    id;
    sessionName;
    sessionDate;
    mcName;
    status;
    createdAt;
    updatedAt;
    teams;
    sessionGames;
};
exports.Session = Session;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], Session.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'session_name' }),
    __metadata("design:type", String)
], Session.prototype, "sessionName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'datetime',
        name: 'session_date',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Session.prototype, "sessionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'mc_name' }),
    __metadata("design:type", String)
], Session.prototype, "mcName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SessionStatus,
        default: SessionStatus.READY,
    }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Session.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Session.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => team_entity_1.Team, (team) => team.session),
    __metadata("design:type", Array)
], Session.prototype, "teams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => session_game_entity_1.SessionGame, (sessionGame) => sessionGame.session),
    __metadata("design:type", Array)
], Session.prototype, "sessionGames", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)('sessions')
], Session);
//# sourceMappingURL=session.entity.js.map