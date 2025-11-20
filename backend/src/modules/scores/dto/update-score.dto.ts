import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateScoreDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  correctCount?: number;

  @IsOptional()
  @IsInt()
  participantId?: number;
}
