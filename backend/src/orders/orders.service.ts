import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(customerId: string, data: {
    restaurantId: string;
    items: Array<{ menuItemId: string; quantity: number; price: number; notes?: string }>;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    deliveryAddress: string;
    specialInstructions?: string;
  }) {
    // If paid via WALLET, verify balance
    if (data.paymentMethod === 'WALLET') {
      const wallet = await this.prisma.wallet.findUnique({ where: { userId: customerId } });
      if (!wallet || wallet.balance < data.totalAmount) {
        throw new BadRequestException('Insufficient wallet balance');
      }
      // Deduct wallet balance
      await this.prisma.wallet.update({
        where: { userId: customerId },
        data: { balance: wallet.balance - data.totalAmount },
      });
    }

    const pickupPin = Math.floor(1000 + Math.random() * 9000).toString();

    return this.prisma.order.create({
      data: {
        customerId,
        restaurantId: data.restaurantId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod || 'CREDIT_CARD',
        pickupPin,
        deliveryAddress: data.deliveryAddress,
        specialInstructions: data.specialInstructions,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
          })),
        },
      },
      include: {
        restaurant: true,
        items: { include: { menuItem: true } },
      },
    });
  }

  async getCustomerOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        restaurant: true,
        driver: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRestaurantOrders(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        customer: true,
        driver: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailableDriverOrders() {
    return this.prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.READY, OrderStatus.ACCEPTED, OrderStatus.PREPARING] },
        driverId: null,
      },
      include: {
        restaurant: true,
        customer: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        restaurant: true,
        customer: true,
        driver: true,
      },
    });
  }

  async assignDriver(orderId: string, driverId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        driverId,
        status: OrderStatus.OUT_FOR_DELIVERY,
      },
      include: {
        driver: true,
        restaurant: true,
      },
    });
  }

  async verifyPickupPin(orderId: string, pin: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.pickupPin !== pin) {
      throw new BadRequestException('Incorrect 4-digit pickup PIN');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.OUT_FOR_DELIVERY },
    });
  }
}
