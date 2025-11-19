import { IsString, IsEnum, IsInt } from 'class-validator';
import { TeamType } from '../../../database/entities/team.entity';

export class CreateTeamDto {
  @IsInt()
  sessionId: number;

  @IsString()
  teamName: string;

  @IsEnum(TeamType)
  teamType: TeamType;
}
