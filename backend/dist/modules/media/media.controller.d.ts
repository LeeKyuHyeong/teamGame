import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    create(createMediaDto: CreateMediaDto): Promise<import("../../database/entities/media-content.entity").MediaContent>;
    findAll(random?: string): Promise<import("../../database/entities/media-content.entity").MediaContent[]>;
    findOne(id: string): Promise<import("../../database/entities/media-content.entity").MediaContent>;
    update(id: string, updateDto: Partial<CreateMediaDto>): Promise<import("../../database/entities/media-content.entity").MediaContent>;
    remove(id: string): Promise<void>;
}
