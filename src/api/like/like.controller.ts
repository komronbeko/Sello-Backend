import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Likes')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Get(':user_id')
  getUserLikes(@Param('user_id') user_id: string) {
    return this.likeService.getUserLikes(+user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }

  @Delete('/all/:user_id')
  removeAll(@Param('user_id') user_id: string) {
    return this.likeService.removeAll(+user_id);
  }
}
