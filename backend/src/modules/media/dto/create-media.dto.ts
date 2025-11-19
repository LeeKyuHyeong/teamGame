import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MediaType } from '../../../database/entities/media-content.entity';

export class CreateMediaDto {
  @IsString()
  imagePath: string;

  @IsString()
  title: string;

  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsOptional()
  @IsString()
  description?: string;
}
