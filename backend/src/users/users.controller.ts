import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Post('addresses')
  addAddress(@Request() req, @Body() body: { label?: string; street: string; apt?: string; city: string; zip: string; isDefault?: boolean }) {
    return this.usersService.addAddress(req.user.id, body);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(req.user.id, addressId);
  }

  @Post('wallet/topup')
  topupWallet(@Request() req, @Body() body: { amount: number }) {
    return this.usersService.topupWallet(req.user.id, body.amount);
  }
}
