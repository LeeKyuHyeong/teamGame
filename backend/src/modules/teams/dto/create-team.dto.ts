import { IsString, IsEnum, IsInt } from 'class-validator';

export class CreateTeamDto {
  @IsInt()
  sessionId: number;

  @IsString()
  teamName: string;

}
