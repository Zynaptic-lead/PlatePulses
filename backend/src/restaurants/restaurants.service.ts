import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // Auto-seed default restaurants if Neon DB has no restaurants
  private async ensureSeedData() {
    const count = await this.prisma.restaurant.count();
    if (count > 0) return;

    // Create system owner for seeded restaurants
    let systemUser = await this.prisma.user.findFirst({ where: { email: 'restaurant@platepulse.com' } });
    if (!systemUser) {
      systemUser = await this.prisma.user.create({
        data: {
          email: 'restaurant@platepulse.com',
          password: '$2b$10$wTz8k8zN/6sR9r.Q10h8ue3g3/N5X0z6Z8h9X0z6Z8h9X0z6Z8h9X', // password123
          name: 'Chef Mario Rossi',
          role: 'RESTAURANT_OWNER',
        },
      });
    }

    // Seed Restaurant 1: Pizza Heaven
    await this.prisma.restaurant.create({
      data: {
        id: '1',
        ownerId: systemUser.id,
        name: 'Pizza Heaven',
        cuisine: 'Italian',
        description: 'Authentic Neapolitan pizzas baked in wood-fired oven. Family recipe since 1985.',
        chefName: 'Chef Mario Rossi',
        rating: 4.8,
        reviewsCount: 2341,
        deliveryTime: 25,
        deliveryFee: 2.99,
        minOrder: 15.0,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format',
        isLive: true,
        isOpen: true,
        liveStream: {
          create: {
            activeCamera: 'cam1',
            isBroadcasting: true,
            viewerCount: 342,
            announcementText: '🔥 Chef Mario is preparing fresh Wood-Fired Margherita Pizzas right now!',
          },
        },
        menuItems: {
          create: [
            { id: 'ITEM-01', name: 'Wood-Fired Margherita Pizza', category: 'Pizza', price: 18.50, prepTime: 15, description: 'San Marzano tomatoes, fresh mozzarella di bufala, organic basil, extra virgin olive oil.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format', isPopular: true, inStock: true, isVegetarian: true },
            { id: 'ITEM-02', name: 'Quattro Formaggi Pizza', category: 'Pizza', price: 21.00, prepTime: 18, description: 'Mozzarella, gorgonzola, parmesan, fontina cheese with white garlic oil drizzle.', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&auto=format', isPopular: true, inStock: true },
            { id: 'ITEM-03', name: 'Diablo Spicy Pepperoni', category: 'Pizza', price: 20.50, prepTime: 16, description: 'Double spicy artisan pepperoni, hot honey drizzle, crushed red pepper flakes.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format', isSpicy: true, inStock: true, isPopular: true },
            { id: 'ITEM-04', name: 'Truffle Garlic Breadsticks', category: 'Appetizers', price: 9.00, prepTime: 10, description: 'Freshly baked dough sticks infused with black truffle oil and roasted garlic.', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format', isVegetarian: true, inStock: true },
          ],
        },
      },
    });

    // Seed Restaurant 2: Sushi Master
    await this.prisma.restaurant.create({
      data: {
        id: '2',
        ownerId: systemUser.id,
        name: 'Sushi Master',
        cuisine: 'Japanese',
        description: 'Premium sushi made with fresh fish flown in daily from Tokyo markets.',
        chefName: 'Kenji Tanaka',
        rating: 4.9,
        reviewsCount: 1856,
        deliveryTime: 35,
        deliveryFee: 3.99,
        minOrder: 25.0,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&auto=format',
        isLive: false,
        isOpen: true,
        liveStream: {
          create: {
            activeCamera: 'cam1',
            isBroadcasting: false,
            viewerCount: 0,
          },
        },
        menuItems: {
          create: [
            { id: 'ITEM-11', name: 'Dragon Roll (8pcs)', category: 'Sushi', price: 19.00, prepTime: 20, description: 'Eel, avocado, cucumber, unagi sauce, sesame seeds.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format', isPopular: true, inStock: true },
            { id: 'ITEM-12', name: 'Salmon Nigiri (4pcs)', category: 'Sushi', price: 14.50, prepTime: 12, description: 'Fresh Atlantic salmon over seasoned sushi rice.', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format', isPopular: true, inStock: true },
          ],
        },
      },
    });

    // Seed Restaurant 3: Burger House
    await this.prisma.restaurant.create({
      data: {
        id: '3',
        ownerId: systemUser.id,
        name: 'Burger House',
        cuisine: 'American',
        description: 'Gourmet burgers with grass-fed beef, fresh toppings, and secret sauce.',
        chefName: 'Sarah Johnson',
        rating: 4.7,
        reviewsCount: 3452,
        deliveryTime: 20,
        deliveryFee: 1.99,
        minOrder: 12.0,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format',
        isLive: true,
        isOpen: true,
        liveStream: {
          create: {
            activeCamera: 'cam2',
            isBroadcasting: true,
            viewerCount: 189,
            announcementText: '🍔 Grilling fresh smashed burgers live!',
          },
        },
        menuItems: {
          create: [
            { id: 'ITEM-21', name: 'Double Bacon Cheeseburger', category: 'Burgers', price: 14.00, prepTime: 12, description: 'Double beef patty, smoked bacon, cheddar, house sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format', isPopular: true, inStock: true },
          ],
        },
      },
    });
  }

  async findAll(search?: string, cuisine?: string) {
    await this.ensureSeedData();

    const where: any = {};
    if (cuisine && cuisine !== 'All') {
      where.cuisine = { equals: cuisine, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.restaurant.findMany({
      where,
      include: {
        liveStream: true,
        menuItems: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string) {
    await this.ensureSeedData();

    // 1. Try finding by ID
    let restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        liveStream: true,
        menuItems: true,
      },
    });

    // 2. If not found by ID, fallback to first restaurant
    if (!restaurant) {
      restaurant = await this.prisma.restaurant.findFirst({
        include: {
          liveStream: true,
          menuItems: true,
        },
      });
    }

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async getMyRestaurant(ownerId: string) {
    await this.ensureSeedData();

    let restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId },
      include: {
        liveStream: true,
        menuItems: true,
        orders: {
          include: { items: { include: { menuItem: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Fallback to ID '1' if none owned
    if (!restaurant) {
      restaurant = await this.prisma.restaurant.findUnique({
        where: { id: '1' },
        include: {
          liveStream: true,
          menuItems: true,
          orders: {
            include: { items: { include: { menuItem: true } } },
          },
        },
      });
    }

    return restaurant;
  }

  async create(ownerId: string, data: any) {
    return this.prisma.restaurant.create({
      data: {
        ...data,
        ownerId,
        liveStream: {
          create: {
            activeCamera: 'cam1',
            isBroadcasting: false,
          },
        },
      },
    });
  }
}
