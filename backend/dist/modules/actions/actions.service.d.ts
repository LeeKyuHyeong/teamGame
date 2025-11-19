import { Repository } from 'typeorm';
import { ActionItem } from '../../database/entities/action-item.entity';
import { CreateActionDto } from './dto/create-action.dto';
export declare class ActionsService {
    private readonly actionRepository;
    constructor(actionRepository: Repository<ActionItem>);
    create(dto: CreateActionDto): Promise<ActionItem>;
    findAll(): Promise<ActionItem[]>;
    findOne(id: number): Promise<ActionItem>;
    update(id: number, dto: Partial<CreateActionDto>): Promise<ActionItem>;
    remove(id: number): Promise<void>;
    getRandom(count?: number): Promise<ActionItem[]>;
}
