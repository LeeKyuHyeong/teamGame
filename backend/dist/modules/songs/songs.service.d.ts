import { Repository } from 'typeorm';
import { Song } from '../../database/entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
export declare class SongsService {
    private readonly songRepository;
    constructor(songRepository: Repository<Song>);
    create(createSongDto: CreateSongDto): Promise<Song>;
    findAll(): Promise<Song[]>;
    findOne(id: number): Promise<Song>;
    update(id: number, updateSongDto: Partial<CreateSongDto>): Promise<Song>;
    remove(id: number): Promise<void>;
    getRandom(count?: number, releaseYear?: String): Promise<Song[]>;
    getAvailableYears(): Promise<String[]>;
}
