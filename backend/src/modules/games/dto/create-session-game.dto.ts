import { IsInt, IsString } from 'class-validator';

export class CreateSessionGameDto {
  @IsInt()
  sessionId: number;

  @IsString()
  gameCode: string; // 'SONG', 'MEDIA', 'SPEED', 'ACTION'

  @IsInt()
  gameOrder: number;
}
