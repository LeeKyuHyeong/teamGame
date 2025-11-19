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
exports.SpeedController = void 0;
const common_1 = require("@nestjs/common");
const speed_service_1 = require("./speed.service");
const speed_dto_1 = require("./dto/speed.dto");
let SpeedController = class SpeedController {
    speedService;
    constructor(speedService) {
        this.speedService = speedService;
    }
    createCategory(dto) {
        return this.speedService.createCategory(dto);
    }
    findAllCategories() {
        return this.speedService.findAllCategories();
    }
    findOneCategory(id) {
        return this.speedService.findOneCategory(+id);
    }
    getShuffledItems(id) {
        return this.speedService.getShuffledItems(+id);
    }
    removeCategory(id) {
        return this.speedService.removeCategory(+id);
    }
    createItem(dto) {
        return this.speedService.createItem(dto);
    }
    removeItem(id) {
        return this.speedService.removeItem(+id);
    }
};
exports.SpeedController = SpeedController;
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [speed_dto_1.CreateSpeedCategoryDto]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "findOneCategory", null);
__decorate([
    (0, common_1.Get)('categories/:id/shuffled'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "getShuffledItems", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [speed_dto_1.CreateSpeedItemDto]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "createItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpeedController.prototype, "removeItem", null);
exports.SpeedController = SpeedController = __decorate([
    (0, common_1.Controller)('speed'),
    __metadata("design:paramtypes", [speed_service_1.SpeedService])
], SpeedController);
//# sourceMappingURL=speed.controller.js.map