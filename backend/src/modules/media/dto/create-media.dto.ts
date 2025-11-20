import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MediaType } from '../../../database/entities/media-content.entity';

export class CreateMediaDto {
  @IsString()
  imageUrl: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsString()
  description?: string;
}
