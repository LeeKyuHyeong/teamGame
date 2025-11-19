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
exports.SpeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const speed_category_entity_1 = require("../../database/entities/speed-category.entity");
const speed_item_entity_1 = require("../../database/entities/speed-item.entity");
let SpeedService = class SpeedService {
    categoryRepository;
    itemRepository;
    constructor(categoryRepository, itemRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
    }
    async createCategory(dto) {
        const category = this.categoryRepository.create(dto);
        return await this.categoryRepository.save(category);
    }
    async findAllCategories() {
        return await this.categoryRepository.find({
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOneCategory(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async createItem(dto) {
        const item = this.itemRepository.create(dto);
        return await this.itemRepository.save(item);
    }
    async findItemsByCategory(categoryId) {
        return await this.itemRepository.find({
            where: { categoryId },
            order: { displayOrder: 'ASC' },
        });
    }
    async getShuffledItems(categoryId) {
        const items = await this.findItemsByCategory(categoryId);
        return items.sort(() => Math.random() - 0.5);
    }
    async removeCategory(id) {
        const category = await this.findOneCategory(id);
        await this.categoryRepository.remove(category);
    }
    async removeItem(id) {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        await this.itemRepository.remove(item);
    }
};
exports.SpeedService = SpeedService;
exports.SpeedService = SpeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(speed_category_entity_1.SpeedCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(speed_item_entity_1.SpeedItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SpeedService);
//# sourceMappingURL=speed.service.js.map