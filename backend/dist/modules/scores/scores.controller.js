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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoresController = void 0;
const common_1 = require("@nestjs/common");
const scores_service_1 = require("./scores.service");
const assign_score_dto_1 = require("./dto/assign-score.dto");
const update_score_dto_1 = require("./dto/update-score.dto");
let ScoresController = class ScoresController {
    scoresService;
    constructor(scoresService) {
        this.scoresService = scoresService;
    }
    assignScore(assignScoreDto) {
        return this.scoresService.assignScore(assignScoreDto);
    }
    find(roundId, teamId) {
        if (roundId) {
            return this.scoresService.findByRound(+roundId);
        }
        if (teamId) {
            return this.scoresService.findByTeam(+teamId);
        }
        return [];
    }
    findOne(id) {
        return this.scoresService.findOne(+id);
    }
    compareScores(roundId) {
        return this.scoresService.compareScores(+roundId);
    }
    update(id, updateScoreDto) {
        return this.scoresService.update(+id, updateScoreDto);
    }
    remove(id) {
        return this.scoresService.remove(+id);
    }
};
exports.ScoresController = ScoresController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_score_dto_1.AssignScoreDto]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "assignScore", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('roundId')),
    __param(1, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "find", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('round/:roundId/compare'),
    __param(0, (0, common_1.Param)('roundId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "compareScores", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_score_dto_1.UpdateScoreDto]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "remove", null);
exports.ScoresController = ScoresController = __decorate([
    (0, common_1.Controller)('scores'),
    __metadata("design:paramtypes", [scores_service_1.ScoresService])
], ScoresController);
//# sourceMappingURL=scores.controller.js.map