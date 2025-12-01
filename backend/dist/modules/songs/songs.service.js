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
exports.SongsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const song_entity_1 = require("../../database/entities/song.entity");
let SongsService = class SongsService {
    songRepository;
    constructor(songRepository) {
        this.songRepository = songRepository;
    }
    async create(createSongDto) {
        const song = this.songRepository.create(createSongDto);
        return await this.songRepository.save(song);
    }
    async findAll() {
        return await this.songRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const song = await this.songRepository.findOne({
            where: { id },
        });
        if (!song) {
            throw new common_1.NotFoundException(`Song with ID ${id} not found`);
        }
        return song;
    }
    async update(id, updateSongDto) {
        const song = await this.findOne(id);
        Object.assign(song, updateSongDto);
        return await this.songRepository.save(song);
    }
    async remove(id) {
        const song = await this.findOne(id);
        await this.songRepository.remove(song);
    }
    async getRandom(count = 5, decade) {
        console.log('[SongsService] getRandom 호출, count:', count, 'decade:', decade);
        const queryBuilder = this.songRepository
            .createQueryBuilder('song');
        if (decade) {
            let startYear;
            let endYear;
            switch (decade) {
                case '1990s':
                    startYear = 1990;
                    endYear = 1999;
                    break;
                case '2000s':
                    startYear = 2000;
                    endYear = 2009;
                    break;
                case '2010s':
                    startYear = 2010;
                    endYear = 2019;
                    break;
                case '2020s':
                    startYear = 2020;
                    endYear = 2029;
                    break;
                default:
                    startYear = 1900;
                    endYear = 2100;
            }
            console.log(`[SongsService] 년도 필터: ${startYear} ~ ${endYear}`);
            queryBuilder.where('song.release_year BETWEEN :startYear AND :endYear', {
                startYear,
                endYear,
            });
        }
        const songs = await queryBuilder
            .orderBy('RAND()')
            .limit(count)
            .getMany();
        console.log('[SongsService] 조회된 노래 수:', songs.length);
        return songs;
    }
    async getAvailableDecades() {
        console.log('[SongsService] getAvailableDecades 호출');
        const songs = await this.songRepository.find({
            select: ['releaseYear'],
        });
        console.log('[SongsService] 전체 노래 개수:', songs.length);
        if (songs.length > 0) {
            console.log('[SongsService] 첫 번째 노래의 releaseYear:', songs[0].releaseYear);
        }
        const decades = {
            '1990s': { label: '1990년대', count: 0 },
            '2000s': { label: '2000년대', count: 0 },
            '2010s': { label: '2010년대', count: 0 },
            '2020s': { label: '2020년대', count: 0 },
        };
        songs.forEach(song => {
            const year = song.releaseYear;
            if (!year) {
                console.log('[SongsService] releaseYear가 null인 노래 발견');
                return;
            }
            if (year >= 1990 && year <= 1999) {
                decades['1990s'].count++;
            }
            else if (year >= 2000 && year <= 2009) {
                decades['2000s'].count++;
            }
            else if (year >= 2010 && year <= 2019) {
                decades['2010s'].count++;
            }
            else if (year >= 2020 && year <= 2029) {
                decades['2020s'].count++;
            }
            else {
                console.log(`[SongsService] 범위 밖 연도: ${year}`);
            }
        });
        console.log('[SongsService] 년대별 카운트:', JSON.stringify(decades, null, 2));
        const result = Object.entries(decades)
            .filter(([_, data]) => data.count > 0)
            .map(([decade, data]) => ({
            decade,
            label: data.label,
            count: data.count,
        }));
        console.log('[SongsService] 반환 결과:', JSON.stringify(result, null, 2));
        return result;
    }
};
exports.SongsService = SongsService;
exports.SongsService = SongsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SongsService);
//# sourceMappingURL=songs.service.js.map