import { IsString, IsOptional } from 'class-validator';

export class CreateActionDto {
  @IsString()
  actionName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
