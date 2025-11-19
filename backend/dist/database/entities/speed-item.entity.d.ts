import { SpeedCategory } from './speed-category.entity';
export declare class SpeedItem {
    id: number;
    categoryId: number;
    itemName: string;
    displayOrder: number;
    createdAt: Date;
    category: SpeedCategory;
}
