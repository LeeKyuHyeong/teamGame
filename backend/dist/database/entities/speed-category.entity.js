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
exports.SpeedCategory = void 0;
const typeorm_1 = require("typeorm");
const speed_item_entity_1 = require("./speed-item.entity");
let SpeedCategory = class SpeedCategory {
    id;
    categoryName;
    description;
    createdAt;
    updatedAt;
    items;
};
exports.SpeedCategory = SpeedCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], SpeedCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'category_name' }),
    __metadata("design:type", String)
], SpeedCategory.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpeedCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SpeedCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SpeedCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => speed_item_entity_1.SpeedItem, (speedItem) => speedItem.category),
    __metadata("design:type", Array)
], SpeedCategory.prototype, "items", void 0);
exports.SpeedCategory = SpeedCategory = __decorate([
    (0, typeorm_1.Entity)('speed_categories')
], SpeedCategory);
//# sourceMappingURL=speed-category.entity.js.map