import type mongoose from 'mongoose';

import type { User } from '../../../domain/entities/user.entity';
import type {
  DashboardStatsResult,
  IAdminRepository,
} from '../../../domain/repositories/admin/admin.repository.interface';
import { UserModel, type IUserDocument } from '../../database/model/user.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { EventManager } from '../../../domain/entities/manager.entity';
import {
  EventManagerModel,
  type IEventManagerDocument,
} from '../../database/model/manager.model';
import { userMapper } from '../../../common/mappers/user.mapper';
import { managerMapper } from '../../../common/mappers/manager.mapper';
import { EventModel } from '../../database/model/events/event.model';
import { BookingModel } from '../../database/model/booking.model';
import { PaymentModel } from '../../database/model/payment/payment.model';

export class AdminRepository implements IAdminRepository {
  async findAllUser(
    params: PaginationParams,
  ): Promise<PaginatedResponse<User> | null> {
    const { page = 1, limit = 10, search, role, applyingupgrade } = params;
    const query: mongoose.FilterQuery<IUserDocument> = {
      role: { $ne: 'ADMIN' }, // always exclude admin
    };

    if (role) {
      query.role = role;
    }

    if (applyingupgrade !== undefined) {
      query.applyingupgrade = applyingupgrade;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).exec(),
      UserModel.countDocuments(query).exec(),
    ]);

    if (!users || users.length === 0) {
      return {
        data: [],
        metadata: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const data = users.map((user) =>
      userMapper.toDomain(user as unknown as Record<string, unknown>),
    );

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    }
    return userMapper.toDomain(user as unknown as Record<string, unknown>);
  }

  async findByuserId(
    id: string,
    search?: string,
  ): Promise<EventManager | null> {
    const query: mongoose.FilterQuery<IEventManagerDocument> = {
      userId: id as unknown as mongoose.Types.ObjectId,
    };
    if (search) {
      query.$or = [{ fullName: { $regex: search, $options: 'i' } }];
    }
    const manager = await EventManagerModel.findOne(query);

    if (!manager) {
      return null;
    }

    return managerMapper.toDomain(
      manager as unknown as Record<string, unknown>,
    );
  }

  async getDashboardStats(): Promise<DashboardStatsResult> {
    const totalUsers = await UserModel.countDocuments();
    const eventManagers = await UserModel.countDocuments({
      role: 'EVENT_MANAGER',
    });
    const activeEvents = await EventModel.countDocuments({ status: 'LIVE' });

    const bookingCommissions = await BookingModel.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
    ]);

    const subscriptionFees = await PaymentModel.aggregate([
      { $match: { purpose: 'SUBSCRIPTION', paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const publishingFees = await PaymentModel.aggregate([
      { $match: { purpose: 'EVENT_PUBLISH', paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const commissionRevenue = bookingCommissions[0]?.total || 0;
    const subscriptionRevenue = subscriptionFees[0]?.total || 0;
    const publishingRevenue = publishingFees[0]?.total || 0;
    const totalRevenue =
      commissionRevenue + subscriptionRevenue + publishingRevenue;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const payments = await PaymentModel.find({
      paymentStatus: 'SUCCESS',
      createdAt: { $gte: sixMonthsAgo },
    });

    const bookings = await BookingModel.find({
      status: 'CONFIRMED',
      createdAt: { $gte: sixMonthsAgo },
    });

    const users = await UserModel.find(
      { createdAt: { $gte: sixMonthsAgo } },
      'createdAt role',
    );

    const trend: DashboardStatsResult['trend'] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trend.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('default', { month: 'short' }),
        subscription: 0,
        publishing: 0,
        commission: 0,
        total: 0,
        users: 0,
        managers: 0,
      });
    }

    for (const payment of payments) {
      const pDate = new Date(payment.createdAt);
      const m = trend.find(
        (x) => x.year === pDate.getFullYear() && x.month === pDate.getMonth(),
      );
      if (m) {
        if (payment.purpose === 'SUBSCRIPTION') {
          m.subscription += payment.amount;
        } else if (payment.purpose === 'EVENT_PUBLISH') {
          m.publishing += payment.amount;
        }
      }
    }

    for (const booking of bookings) {
      const bDate = new Date(booking.createdAt);
      const m = trend.find(
        (x) => x.year === bDate.getFullYear() && x.month === bDate.getMonth(),
      );
      if (m) {
        m.commission += booking.commissionAmount;
      }
    }

    for (const user of users) {
      const uDate = new Date(
        (user as unknown as { createdAt: Date }).createdAt || Date.now(),
      );
      const m = trend.find(
        (x) => x.year === uDate.getFullYear() && x.month === uDate.getMonth(),
      );
      if (m) {
        if (user.role === 'EVENT_MANAGER') {
          m.managers += 1;
        } else {
          m.users += 1;
        }
      }
    }

    for (const m of trend) {
      m.subscription = Math.round(m.subscription);
      m.publishing = Math.round(m.publishing);
      m.commission = Math.round(m.commission);
      m.total = m.subscription + m.publishing + m.commission;
    }

    return {
      totalUsers,
      eventManagers,
      activeEvents,
      commissionRevenue: Math.round(commissionRevenue),
      subscriptionRevenue: Math.round(subscriptionRevenue),
      publishingRevenue: Math.round(publishingRevenue),
      totalRevenue: Math.round(totalRevenue),
      trend,
    };
  }
}
