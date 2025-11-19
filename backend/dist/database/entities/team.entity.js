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
exports.Team = exports.TeamType = void 0;
const typeorm_1 = require("typeorm");
const session_entity_1 = require("./session.entity");
const participant_entity_1 = require("./participant.entity");
const round_score_entity_1 = require("./round-score.entity");
var TeamType;
(function (TeamType) {
    TeamType["MALE"] = "\uB0A8\uC131";
    TeamType["FEMALE"] = "\uC5EC\uC131";
})(TeamType || (exports.TeamType = TeamType = {}));
let Team = class Team {
    id;
    sessionId;
    teamName;
    teamType;
    totalScore;
    createdAt;
    session;
    participants;
    roundScores;
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'session_id' }),
    __metadata("design:type", Number)
], Team.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'team_name' }),
    __metadata("design:type", String)
], Team.prototype, "teamName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TeamType, name: 'team_type' }),
    __metadata("design:type", String)
], Team.prototype, "teamType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'total_score' }),
    __metadata("design:type", Number)
], Team.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Team.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_entity_1.Session, (session) => session.teams, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", session_entity_1.Session)
], Team.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participant_entity_1.Participant, (participant) => participant.team),
    __metadata("design:type", Array)
], Team.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => round_score_entity_1.RoundScore, (roundScore) => roundScore.team),
    __metadata("design:type", Array)
], Team.prototype, "roundScores", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)('teams')
], Team);
//# sourceMappingURL=team.entity.js.map