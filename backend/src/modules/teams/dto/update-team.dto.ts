import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalScore?: number;
}
