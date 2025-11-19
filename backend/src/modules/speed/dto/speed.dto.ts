import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateSpeedCategoryDto {
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateSpeedItemDto {
  @IsInt()
  categoryId: number;

  @IsString()
  itemName: string;
}
