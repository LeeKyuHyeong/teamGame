import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
export declare class SongsController {
    private readonly songsService;
    constructor(songsService: SongsService);
    create(createSongDto: CreateSongDto): Promise<import("../../database/entities/song.entity").Song>;
    getAvailableDecades(): Promise<{
        decade: string;
        label: string;
        count: number;
    }[]>;
    findAll(random?: string, decade?: string): Promise<import("../../database/entities/song.entity").Song[]>;
    findOne(id: string): Promise<import("../../database/entities/song.entity").Song>;
    update(id: string, updateSongDto: Partial<CreateSongDto>): Promise<import("../../database/entities/song.entity").Song>;
    remove(id: string): Promise<void>;
}
