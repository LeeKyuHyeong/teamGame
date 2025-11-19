"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const speed_service_1 = require("./speed.service");
const speed_controller_1 = require("./speed.controller");
const speed_category_entity_1 = require("../../database/entities/speed-category.entity");
const speed_item_entity_1 = require("../../database/entities/speed-item.entity");
let SpeedModule = class SpeedModule {
};
exports.SpeedModule = SpeedModule;
exports.SpeedModule = SpeedModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([speed_category_entity_1.SpeedCategory, speed_item_entity_1.SpeedItem])],
        controllers: [speed_controller_1.SpeedController],
        providers: [speed_service_1.SpeedService],
        exports: [speed_service_1.SpeedService],
    })
], SpeedModule);
//# sourceMappingURL=speed.module.js.map