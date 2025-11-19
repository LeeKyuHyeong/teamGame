import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpeedService } from './speed.service';
import { CreateSpeedCategoryDto, CreateSpeedItemDto } from './dto/speed.dto';

@Controller('speed')
export class SpeedController {
  constructor(private readonly speedService: SpeedService) {}

  // 카테고리
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateSpeedCategoryDto) {
    return this.speedService.createCategory(dto);
  }

  @Get('categories')
  findAllCategories() {
    return this.speedService.findAllCategories();
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.speedService.findOneCategory(+id);
  }

  @Get('categories/:id/shuffled')
  getShuffledItems(@Param('id') id: string) {
    return this.speedService.getShuffledItems(+id);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCategory(@Param('id') id: string) {
    return this.speedService.removeCategory(+id);
  }

  // 아이템
  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  createItem(@Body() dto: CreateSpeedItemDto) {
    return this.speedService.createItem(dto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@Param('id') id: string) {
    return this.speedService.removeItem(+id);
  }
}
