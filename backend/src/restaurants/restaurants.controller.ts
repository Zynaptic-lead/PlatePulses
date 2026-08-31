import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('cuisine') cuisine?: string) {
    return this.restaurantsService.findAll(search, cuisine);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT_OWNER)
  @Get('my-store')
  getMyStore(@Request() req) {
    return this.restaurantsService.getMyRestaurant(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.restaurantsService.create(req.user.id, body);
  }
}
