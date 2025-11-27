import { IsString, IsOptional, IsDateString } from 'class-validator';

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
  @IsString()
  teamAName?: string;

  @IsOptional()
  @IsString()
  teamBName?: string;
}
