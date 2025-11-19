import { IsOptional, IsArray, IsInt } from 'class-validator';

export class StartGameDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  contentIds?: number[]; // 게임에서 사용할 콘텐츠 ID 목록
}
