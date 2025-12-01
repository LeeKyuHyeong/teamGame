import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSongDto {
  @IsString()
  youtubeUrl: string;

  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsInt()
  releaseYear: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  startTime?: number;
}
