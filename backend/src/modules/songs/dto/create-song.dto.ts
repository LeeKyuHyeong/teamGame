import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSongDto {
  @IsString()
  youtubeUrl: string;

  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  releaseYear: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  startTime?: number;
}
