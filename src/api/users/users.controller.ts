import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReplenishBalanceDto } from './dto/replenish-balance.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { myReq } from 'src/infra/interfaces/custom-request';

@ApiBearerAuth() // Add this decorator to indicate that the endpoints require authentication
@UseGuards(AuthGuard)
@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('user-one')
  findOne(@Req() request: myReq) {
    return this.usersService.findOne(request.userId);
  }

  @Patch()
  update(@Req() req: myReq, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.userId, updateUserDto);
  }

  @Patch('replenish')
  replenishUserBalance(
    @Req() req: myReq,
    @Body() replenishBalanceDto: ReplenishBalanceDto,
  ) {
    return this.usersService.replenishUserBalance(
      req.userId,
      replenishBalanceDto,
    );
  }
}
