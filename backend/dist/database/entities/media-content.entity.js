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
exports.MediaContent = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
var MediaType;
(function (MediaType) {
    MediaType["DRAMA"] = "\uB4DC\uB77C\uB9C8";
    MediaType["MOVIE"] = "\uC601\uD654";
})(MediaType || (exports.MediaType = MediaType = {}));
let MediaContent = class MediaContent {
    id;
    imageUrl;
    title;
    mediaType;
    description;
    createdAt;
    updatedAt;
};
exports.MediaContent = MediaContent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], MediaContent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'image_url' }),
    __metadata("design:type", String)
], MediaContent.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], MediaContent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MediaType, name: 'media_type', nullable: true }),
    __metadata("design:type", String)
], MediaContent.prototype, "mediaType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MediaContent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MediaContent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MediaContent.prototype, "updatedAt", void 0);
exports.MediaContent = MediaContent = __decorate([
    (0, typeorm_1.Entity)('media_contents')
], MediaContent);
//# sourceMappingURL=media-content.entity.js.map