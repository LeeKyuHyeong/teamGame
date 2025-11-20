import { IsInt, Min, IsOptional } from 'class-validator';

export class AssignScoreDto {
  @IsInt()
  roundId: number;

  @IsInt()
  teamId: number;

  @IsOptional()
  @IsInt()
  participantId?: number;

  @IsInt()
  @Min(0)
  score: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  correctCount?: number;
}
