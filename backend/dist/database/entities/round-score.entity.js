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
exports.RoundScore = void 0;
const typeorm_1 = require("typeorm");
const game_round_entity_1 = require("./game-round.entity");
const team_entity_1 = require("./team.entity");
const participant_entity_1 = require("./participant.entity");
let RoundScore = class RoundScore {
    id;
    roundId;
    teamId;
    participantId;
    score;
    correctCount;
    createdAt;
    round;
    team;
    participant;
};
exports.RoundScore = RoundScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], RoundScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'round_id' }),
    __metadata("design:type", Number)
], RoundScore.prototype, "roundId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'team_id' }),
    __metadata("design:type", Number)
], RoundScore.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'participant_id', nullable: true }),
    __metadata("design:type", Number)
], RoundScore.prototype, "participantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], RoundScore.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'correct_count' }),
    __metadata("design:type", Number)
], RoundScore.prototype, "correctCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RoundScore.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => game_round_entity_1.GameRound, (gameRound) => gameRound.roundScores, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'round_id' }),
    __metadata("design:type", game_round_entity_1.GameRound)
], RoundScore.prototype, "round", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team, (team) => team.roundScores, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'team_id' }),
    __metadata("design:type", team_entity_1.Team)
], RoundScore.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => participant_entity_1.Participant, (participant) => participant.roundScores, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'participant_id' }),
    __metadata("design:type", participant_entity_1.Participant)
], RoundScore.prototype, "participant", void 0);
exports.RoundScore = RoundScore = __decorate([
    (0, typeorm_1.Entity)('round_scores'),
    (0, typeorm_1.Unique)(['roundId', 'teamId'])
], RoundScore);
//# sourceMappingURL=round-score.entity.js.map