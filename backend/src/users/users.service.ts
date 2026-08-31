import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        addresses: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async addAddress(userId: string, data: { label?: string; street: string; apt?: string; city: string; zip: string; isDefault?: boolean }) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        label: data.label || 'Home',
        street: data.street,
        apt: data.apt,
        city: data.city,
        zip: data.zip,
        isDefault: data.isDefault || false,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.deleteMany({
      where: { id: addressId, userId },
    });
  }

  async topupWallet(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return this.prisma.wallet.create({
        data: { userId, balance: amount },
      });
    }
    return this.prisma.wallet.update({
      where: { userId },
      data: { balance: wallet.balance + amount },
    });
  }
}
