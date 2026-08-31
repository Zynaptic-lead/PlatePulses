import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/live-stream')
export class LiveStreamController {
  constructor(private liveStreamService: LiveStreamService) {}

  @Get('restaurant/:id')
  getStream(@Param('id') restaurantId: string) {
    return this.liveStreamService.getStreamByRestaurant(restaurantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
  @Patch('restaurant/:id/toggle')
  toggleBroadcast(@Param('id') restaurantId: string, @Body() body: { isBroadcasting: boolean }) {
    return this.liveStreamService.toggleBroadcast(restaurantId, body.isBroadcasting);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
  @Patch('restaurant/:id/camera')
  updateCamera(@Param('id') restaurantId: string, @Body() body: { activeCamera: string }) {
    return this.liveStreamService.updateCamera(restaurantId, body.activeCamera);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT_OWNER, Role.ADMIN)
  @Patch('restaurant/:id/announcement')
  updateAnnouncement(@Param('id') restaurantId: string, @Body() body: { announcementText: string }) {
    return this.liveStreamService.updateAnnouncement(restaurantId, body.announcementText);
  }
}
