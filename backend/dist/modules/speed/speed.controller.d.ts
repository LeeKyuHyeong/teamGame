import { SpeedService } from './speed.service';
import { CreateSpeedCategoryDto, CreateSpeedItemDto } from './dto/speed.dto';
export declare class SpeedController {
    private readonly speedService;
    constructor(speedService: SpeedService);
    createCategory(dto: CreateSpeedCategoryDto): Promise<import("../../database/entities/speed-category.entity").SpeedCategory>;
    findAllCategories(): Promise<import("../../database/entities/speed-category.entity").SpeedCategory[]>;
    findOneCategory(id: string): Promise<import("../../database/entities/speed-category.entity").SpeedCategory>;
    getShuffledItems(id: string): Promise<import("../../database/entities/speed-item.entity").SpeedItem[]>;
    removeCategory(id: string): Promise<void>;
    createItem(dto: CreateSpeedItemDto): Promise<import("../../database/entities/speed-item.entity").SpeedItem>;
    removeItem(id: string): Promise<void>;
}
