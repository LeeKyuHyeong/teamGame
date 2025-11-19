import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeedCategory } from '../../database/entities/speed-category.entity';
import { SpeedItem } from '../../database/entities/speed-item.entity';
import { CreateSpeedCategoryDto, CreateSpeedItemDto } from './dto/speed.dto';

@Injectable()
export class SpeedService {
  constructor(
    @InjectRepository(SpeedCategory)
    private readonly categoryRepository: Repository<SpeedCategory>,
    @InjectRepository(SpeedItem)
    private readonly itemRepository: Repository<SpeedItem>,
  ) {}

  // 카테고리 생성
  async createCategory(dto: CreateSpeedCategoryDto): Promise<SpeedCategory> {
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  // 카테고리 목록
  async findAllCategories(): Promise<SpeedCategory[]> {
    return await this.categoryRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  // 카테고리 상세
  async findOneCategory(id: number): Promise<SpeedCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // 아이템 추가
  async createItem(dto: CreateSpeedItemDto): Promise<SpeedItem> {
    const item = this.itemRepository.create(dto);
    return await this.itemRepository.save(item);
  }

  // 아이템 목록 (카테고리별)
  async findItemsByCategory(categoryId: number): Promise<SpeedItem[]> {
    return await this.itemRepository.find({
      where: { categoryId },
      order: { displayOrder: 'ASC' },
    });
  }

  // 아이템 셔플 (랜덤 순서로 반환)
  async getShuffledItems(categoryId: number): Promise<SpeedItem[]> {
    const items = await this.findItemsByCategory(categoryId);
    return items.sort(() => Math.random() - 0.5);
  }

  // 카테고리 삭제
  async removeCategory(id: number): Promise<void> {
    const category = await this.findOneCategory(id);
    await this.categoryRepository.remove(category);
  }

  // 아이템 삭제
  async removeItem(id: number): Promise<void> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    await this.itemRepository.remove(item);
  }
}
