import { Repository } from 'typeorm';
import { MediaContent } from '../../database/entities/media-content.entity';
import { CreateMediaDto } from './dto/create-media.dto';
export declare class MediaService {
    private readonly mediaRepository;
    constructor(mediaRepository: Repository<MediaContent>);
    create(createMediaDto: CreateMediaDto): Promise<MediaContent>;
    findAll(): Promise<MediaContent[]>;
    findOne(id: number): Promise<MediaContent>;
    update(id: number, updateDto: Partial<CreateMediaDto>): Promise<MediaContent>;
    remove(id: number): Promise<void>;
    getRandom(count?: number): Promise<MediaContent[]>;
}
