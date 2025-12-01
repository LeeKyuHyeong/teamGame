import { IsOptional, IsArray, IsInt, Min, IsString } from 'class-validator';

export class StartGameDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  contentIds?: number[];

  @IsOptional()
  @IsInt()
  @Min(1)
  roundCount?: number;

  @IsOptional()
  @IsString()
  decade?: string; // '1990s' | '2000s' | '2010s' | '2020s'
}
