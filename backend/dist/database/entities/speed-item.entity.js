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
exports.SpeedItem = void 0;
const typeorm_1 = require("typeorm");
const speed_category_entity_1 = require("./speed-category.entity");
let SpeedItem = class SpeedItem {
    id;
    categoryId;
    itemName;
    displayOrder;
    createdAt;
    category;
};
exports.SpeedItem = SpeedItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'int' }),
    __metadata("design:type", Number)
], SpeedItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'category_id' }),
    __metadata("design:type", Number)
], SpeedItem.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'item_name' }),
    __metadata("design:type", String)
], SpeedItem.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'display_order' }),
    __metadata("design:type", Number)
], SpeedItem.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SpeedItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => speed_category_entity_1.SpeedCategory, (category) => category.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", speed_category_entity_1.SpeedCategory)
], SpeedItem.prototype, "category", void 0);
exports.SpeedItem = SpeedItem = __decorate([
    (0, typeorm_1.Entity)('speed_items')
], SpeedItem);
//# sourceMappingURL=speed-item.entity.js.map