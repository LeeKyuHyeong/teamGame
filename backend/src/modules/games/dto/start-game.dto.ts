import { IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class StartGameDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  contentIds?: number[]; // 게임에서 사용할 콘텐츠 ID 목록 (직접 선택)

  @IsOptional()
  @IsInt()
  @Min(1)
  roundCount?: number; // 랜덤 선택할 라운드 수
}
