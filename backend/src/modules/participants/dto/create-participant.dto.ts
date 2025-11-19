import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateParticipantDto {
  @IsInt()
  teamId: number;

  @IsString()
  participantName: string;

  @IsOptional()
  @IsBoolean()
  isMc?: boolean;
}
