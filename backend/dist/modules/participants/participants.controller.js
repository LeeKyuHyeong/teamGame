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
exports.ParticipantsController = void 0;
const common_1 = require("@nestjs/common");
const participants_service_1 = require("./participants.service");
const create_participant_dto_1 = require("./dto/create-participant.dto");
let ParticipantsController = class ParticipantsController {
    participantsService;
    constructor(participantsService) {
        this.participantsService = participantsService;
    }
    create(createParticipantDto) {
        return this.participantsService.create(createParticipantDto);
    }
    createMany(createParticipantDtos) {
        return this.participantsService.createMany(createParticipantDtos);
    }
    findAll(teamId) {
        if (teamId) {
            return this.participantsService.findByTeam(+teamId);
        }
        return this.participantsService.findAll();
    }
    findOne(id) {
        return this.participantsService.findOne(+id);
    }
    remove(id) {
        return this.participantsService.remove(+id);
    }
};
exports.ParticipantsController = ParticipantsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_participant_dto_1.CreateParticipantDto]),
    __metadata("design:returntype", void 0)
], ParticipantsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ParticipantsController.prototype, "createMany", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParticipantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParticipantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParticipantsController.prototype, "remove", null);
exports.ParticipantsController = ParticipantsController = __decorate([
    (0, common_1.Controller)('participants'),
    __metadata("design:paramtypes", [participants_service_1.ParticipantsService])
], ParticipantsController);
//# sourceMappingURL=participants.controller.js.map