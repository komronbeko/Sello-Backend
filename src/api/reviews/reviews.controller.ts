import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { myReq } from 'src/infra/interfaces/custom-request';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isAdminGuard } from 'src/common/guards/is-admin.guard';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Product Reviews')
@Controller('product-review')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: myReq) {
    return this.reviewsService.create(createReviewDto, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/by-product/:id')
  findProductReviews(@Param('id') product_id: string, @Req() req: myReq) {
    return this.reviewsService.findProductReviews(product_id, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/by-user')
  findUserReviews(@Req() req: myReq) {
    return this.reviewsService.findUserReviews(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/exact/:id')
  getOneReview(@Param('id') product_id: string, @Req() req: myReq) {
    return this.reviewsService.findOneReview(product_id, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(isAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
