import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { SessionStatus } from '../../../database/entities/session.entity';

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  sessionName?: string;

  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @IsOptional()
  @IsString()
  mcName?: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalParticipants?: number;
}
