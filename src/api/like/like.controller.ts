import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { myReq } from 'src/infra/interfaces/custom-request';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Likes')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: myReq) {
    return this.likeService.create(createLikeDto, req.userId);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Get('ofuser')
  getUserLikes(@Req() req: myReq) {
    return this.likeService.getUserLikes(req.userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.likeService.remove(+id);
  // }

  @Delete('/all')
  removeAll(@Req() req: myReq) {
    return this.likeService.removeAll(req.userId);
  }
}
