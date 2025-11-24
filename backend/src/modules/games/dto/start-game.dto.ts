import { IsOptional, IsArray, IsInt, Min, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class TeamSpeedConfig {
  @IsInt()
  teamId: number;

  @IsInt()
  categoryId: number;

  @IsInt()
  @Min(1)
  roundCount: number;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamSpeedConfig)
  teamConfigs?: TeamSpeedConfig[]; // 스피드 게임용 팀별 설정
}
