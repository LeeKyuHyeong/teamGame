import { IsString, IsOptional, IsInt, IsDateString, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  sessionName: string;

  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @IsOptional()
  @IsString()
  mcName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalParticipants?: number;

  @IsOptional()
  @IsString()
  teamAName?: string;

  @IsOptional()
  @IsString()
  teamBName?: string;
}
