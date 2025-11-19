import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MediaType {
  DRAMA = '드라마',
  MOVIE = '영화',
}

@Entity('media_contents')
export class MediaContent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'image_path' })
  imagePath: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'enum', enum: MediaType, name: 'media_type' })
  mediaType: MediaType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
