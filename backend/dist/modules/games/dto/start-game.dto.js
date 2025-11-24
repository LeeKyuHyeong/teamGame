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
exports.StartGameDto = exports.TeamSpeedConfig = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TeamSpeedConfig {
    teamId;
    categoryId;
    roundCount;
}
exports.TeamSpeedConfig = TeamSpeedConfig;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TeamSpeedConfig.prototype, "teamId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TeamSpeedConfig.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TeamSpeedConfig.prototype, "roundCount", void 0);
class StartGameDto {
    contentIds;
    roundCount;
    teamConfigs;
}
exports.StartGameDto = StartGameDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], StartGameDto.prototype, "contentIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], StartGameDto.prototype, "roundCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TeamSpeedConfig),
    __metadata("design:type", Array)
], StartGameDto.prototype, "teamConfigs", void 0);
//# sourceMappingURL=start-game.dto.js.map