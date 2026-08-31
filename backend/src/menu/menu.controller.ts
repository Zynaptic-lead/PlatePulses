import { Controller, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
@Controller('api/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  createDish(@Body() body: any) {
    return this.menuService.createDish(body);
  }

  @Put(':id')
  updateDish(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateDish(id, body);
  }

  @Patch(':id/toggle-stock')
  toggleStock(@Param('id') id: string) {
    return this.menuService.toggleStock(id);
  }

  @Delete(':id')
  deleteDish(@Param('id') id: string) {
    return this.menuService.deleteDish(id);
  }
}
