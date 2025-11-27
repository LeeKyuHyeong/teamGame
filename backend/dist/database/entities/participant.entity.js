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
exports.Participant = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const round_score_entity_1 = require("./round-score.entity");
let Participant = class Participant {
    id;
    teamId;
    participantName;
    isMc;
    totalScore;
    createdAt;
    team;
    roundScores;
};
exports.Participant = Participant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], Participant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'team_id' }),
    __metadata("design:type", Number)
], Participant.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'participant_name' }),
    __metadata("design:type", String)
], Participant.prototype, "participantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_mc' }),
    __metadata("design:type", Boolean)
], Participant.prototype, "isMc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'total_score' }),
    __metadata("design:type", Number)
], Participant.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Participant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team, (team) => team.participants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'team_id' }),
    __metadata("design:type", team_entity_1.Team)
], Participant.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => round_score_entity_1.RoundScore, (roundScore) => roundScore.participant),
    __metadata("design:type", Array)
], Participant.prototype, "roundScores", void 0);
exports.Participant = Participant = __decorate([
    (0, typeorm_1.Entity)('participants')
], Participant);
//# sourceMappingURL=participant.entity.js.map