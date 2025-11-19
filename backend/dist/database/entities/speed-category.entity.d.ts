import { SpeedItem } from './speed-item.entity';
export declare class SpeedCategory {
    id: number;
    categoryName: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    items: SpeedItem[];
}
