import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LiveStreamService {
  constructor(private prisma: PrismaService) {}

  async getStreamByRestaurant(restaurantId: string) {
    const stream = await this.prisma.liveStream.findUnique({
      where: { restaurantId },
    });
    if (!stream) {
      return this.prisma.liveStream.create({
        data: {
          restaurantId,
          activeCamera: 'cam1',
          isBroadcasting: true,
          viewerCount: 342,
          announcementText: '🔥 Chef Mario is preparing fresh Wood-Fired Margherita Pizzas right now!',
        },
      });
    }
    return stream;
  }

  async toggleBroadcast(restaurantId: string, isBroadcasting: boolean) {
    return this.prisma.liveStream.upsert({
      where: { restaurantId },
      update: { isBroadcasting },
      create: {
        restaurantId,
        isBroadcasting,
        activeCamera: 'cam1',
        viewerCount: isBroadcasting ? 342 : 0,
      },
    });
  }

  async updateCamera(restaurantId: string, activeCamera: string) {
    return this.prisma.liveStream.update({
      where: { restaurantId },
      data: { activeCamera },
    });
  }

  async updateAnnouncement(restaurantId: string, announcementText: string) {
    return this.prisma.liveStream.update({
      where: { restaurantId },
      data: { announcementText },
    });
  }
}
