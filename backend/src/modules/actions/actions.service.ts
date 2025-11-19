import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItem } from '../../database/entities/action-item.entity';
import { CreateActionDto } from './dto/create-action.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionItem)
    private readonly actionRepository: Repository<ActionItem>,
  ) {}

  async create(dto: CreateActionDto): Promise<ActionItem> {
    const action = this.actionRepository.create(dto);
    return await this.actionRepository.save(action);
  }

  async findAll(): Promise<ActionItem[]> {
    return await this.actionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ActionItem> {
    const action = await this.actionRepository.findOne({ where: { id } });
    if (!action) {
      throw new NotFoundException(`Action with ID ${id} not found`);
    }
    return action;
  }

  async update(id: number, dto: Partial<CreateActionDto>): Promise<ActionItem> {
    const action = await this.findOne(id);
    Object.assign(action, dto);
    return await this.actionRepository.save(action);
  }

  async remove(id: number): Promise<void> {
    const action = await this.findOne(id);
    await this.actionRepository.remove(action);
  }

  async getRandom(count: number = 5): Promise<ActionItem[]> {
    return await this.actionRepository
      .createQueryBuilder('action')
      .orderBy('RAND()')
      .limit(count)
      .getMany();
  }
}
