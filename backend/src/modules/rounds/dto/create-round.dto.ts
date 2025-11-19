import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateRoundDto {
  @IsInt()
  sessionGameId: number;

  @IsInt()
  roundNumber: number;

  @IsInt()
  contentId: number;

  @IsString()
  contentType: string; // 'SONG', 'MEDIA', 'SPEED', 'ACTION'
}
