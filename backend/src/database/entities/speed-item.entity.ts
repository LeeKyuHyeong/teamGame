import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SpeedCategory } from './speed-category.entity';

@Entity('speed_items')
export class SpeedItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'category_id' })
  categoryId: number;

  @Column({ type: 'varchar', length: 100, name: 'item_name' })
  itemName: string;

  @Column({ type: 'int', nullable: true, name: 'display_order' })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SpeedCategory, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: SpeedCategory;
}
