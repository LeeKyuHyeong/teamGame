import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.create(createParticipantDto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() createParticipantDtos: CreateParticipantDto[]) {
    return this.participantsService.createMany(createParticipantDtos);
  }

  @Get()
  findAll(@Query('teamId') teamId?: string) {
    if (teamId) {
      return this.participantsService.findByTeam(+teamId);
    }
    return this.participantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id);
  }
}
