import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req, @Body() body: any) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  @Get('my-orders')
  getCustomerOrders(@Request() req) {
    return this.ordersService.getCustomerOrders(req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.DRIVER, Role.ADMIN)
  @Get('available-pickups')
  getAvailableDriverOrders() {
    return this.ordersService.getAvailableDriverOrders();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
  @Get('restaurant/:id')
  getRestaurantOrders(@Param('id') restaurantId: string) {
    return this.ordersService.getRestaurantOrders(restaurantId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') orderId: string, @Body() body: { status: OrderStatus }) {
    return this.ordersService.updateOrderStatus(orderId, body.status);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.DRIVER, Role.ADMIN)
  @Patch(':id/claim')
  claimOrder(@Request() req, @Param('id') orderId: string) {
    return this.ordersService.assignDriver(orderId, req.user.id);
  }

  @Patch(':id/verify-pin')
  verifyPin(@Param('id') orderId: string, @Body() body: { pin: string }) {
    return this.ordersService.verifyPickupPin(orderId, body.pin);
  }
}
