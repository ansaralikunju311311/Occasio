import type mongoose from 'mongoose';

import { User } from '../../../domain/entities/user.entity';
import type { IAdminRepository } from '../../../domain/repositories/admin/admin.repository.interface';
import { UserModel, type IUserDocument } from '../../database/model/user.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import { EventManager } from '../../../domain/entities/manager.entity';
import {
  EventManagerModel,
  type IEventManagerDocument,
} from '../../database/model/manager.model';

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

    const data = users.map(
      (user) =>
        new User(
          user._id.toString(),
          user.name,
          user.email,
          user.password,
          user.role,
          user.status,
          user.isVerified,
          user.applyingupgrade,
          user.rejectedAt,
          user.reapplyAt,
        ),
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
    return new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.role,
      user.status,
      user.isVerified,

      user.applyingupgrade,
      user.rejectedAt,
      user.reapplyAt,
    );
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

    return new EventManager(
      manager._id.toString(),
      manager.userId.toString(),
      manager.fullName,
      manager.organizationName,
      manager.aboutEvents,
      manager.certificate,
      manager.documentReference,
      manager.experienceLevel,
      manager.socialLinks,
      manager.organizationType,
    );
  }
}
