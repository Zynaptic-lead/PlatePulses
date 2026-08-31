import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createDish(data: {
    restaurantId: string;
    name: string;
    category: string;
    price: number;
    prepTime?: number;
    description?: string;
    image?: string;
    inStock?: boolean;
    isSpicy?: boolean;
    isVegetarian?: boolean;
    isPopular?: boolean;
  }) {
    return this.prisma.menuItem.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        prepTime: data.prepTime ? Number(data.prepTime) : 15,
        description: data.description,
        image: data.image,
        inStock: data.inStock ?? true,
        isSpicy: data.isSpicy ?? false,
        isVegetarian: data.isVegetarian ?? false,
        isPopular: data.isPopular ?? false,
      },
    });
  }

  async updateDish(id: string, data: any) {
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async toggleStock(id: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return this.prisma.menuItem.update({
      where: { id },
      data: { inStock: !item.inStock },
    });
  }

  async deleteDish(id: string) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
