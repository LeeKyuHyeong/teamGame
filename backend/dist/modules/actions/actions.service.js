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
exports.ActionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const action_item_entity_1 = require("../../database/entities/action-item.entity");
let ActionsService = class ActionsService {
    actionRepository;
    constructor(actionRepository) {
        this.actionRepository = actionRepository;
    }
    async create(dto) {
        const action = this.actionRepository.create(dto);
        return await this.actionRepository.save(action);
    }
    async findAll() {
        return await this.actionRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const action = await this.actionRepository.findOne({ where: { id } });
        if (!action) {
            throw new common_1.NotFoundException(`Action with ID ${id} not found`);
        }
        return action;
    }
    async update(id, dto) {
        const action = await this.findOne(id);
        Object.assign(action, dto);
        return await this.actionRepository.save(action);
    }
    async remove(id) {
        const action = await this.findOne(id);
        await this.actionRepository.remove(action);
    }
    async getRandom(count = 5) {
        return await this.actionRepository
            .createQueryBuilder('action')
            .orderBy('RAND()')
            .limit(count)
            .getMany();
    }
};
exports.ActionsService = ActionsService;
exports.ActionsService = ActionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(action_item_entity_1.ActionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActionsService);
//# sourceMappingURL=actions.service.js.map