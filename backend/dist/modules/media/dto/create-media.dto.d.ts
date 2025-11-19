import { MediaType } from '../../../database/entities/media-content.entity';
export declare class CreateMediaDto {
    imagePath: string;
    title: string;
    mediaType: MediaType;
    description?: string;
}
