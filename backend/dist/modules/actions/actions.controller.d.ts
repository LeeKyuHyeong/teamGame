import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
export declare class ActionsController {
    private readonly actionsService;
    constructor(actionsService: ActionsService);
    create(dto: CreateActionDto): Promise<import("../../database/entities/action-item.entity").ActionItem>;
    findAll(random?: string): Promise<import("../../database/entities/action-item.entity").ActionItem[]>;
    findOne(id: string): Promise<import("../../database/entities/action-item.entity").ActionItem>;
    update(id: string, dto: Partial<CreateActionDto>): Promise<import("../../database/entities/action-item.entity").ActionItem>;
    remove(id: string): Promise<void>;
}
