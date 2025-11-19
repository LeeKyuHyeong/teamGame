import { Repository } from 'typeorm';
import { SpeedCategory } from '../../database/entities/speed-category.entity';
import { SpeedItem } from '../../database/entities/speed-item.entity';
import { CreateSpeedCategoryDto, CreateSpeedItemDto } from './dto/speed.dto';
export declare class SpeedService {
    private readonly categoryRepository;
    private readonly itemRepository;
    constructor(categoryRepository: Repository<SpeedCategory>, itemRepository: Repository<SpeedItem>);
    createCategory(dto: CreateSpeedCategoryDto): Promise<SpeedCategory>;
    findAllCategories(): Promise<SpeedCategory[]>;
    findOneCategory(id: number): Promise<SpeedCategory>;
    createItem(dto: CreateSpeedItemDto): Promise<SpeedItem>;
    findItemsByCategory(categoryId: number): Promise<SpeedItem[]>;
    getShuffledItems(categoryId: number): Promise<SpeedItem[]>;
    removeCategory(id: number): Promise<void>;
    removeItem(id: number): Promise<void>;
}
