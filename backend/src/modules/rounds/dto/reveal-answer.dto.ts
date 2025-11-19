import { IsBoolean } from 'class-validator';

export class RevealAnswerDto {
  @IsBoolean()
  reveal: boolean;
}
