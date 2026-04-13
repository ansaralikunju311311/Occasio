import { User } from '../../../domain/entities/user.entity';
import { IAdminRepository } from '../../../domain/repositories/admin/admin.repository.interface';
import { UserModel } from '../../database/model/user.model';
import { PaginationParams, PaginatedResponse } from '../../../common/interfaces/pagination.interface';
import { EventManager } from '../../../domain/entities/manager.entity';
import { EventManagerModel } from '../../database/model/manager.model';

export class AdminRepository implements IAdminRepository {
  async findAllUser(params: PaginationParams): Promise<PaginatedResponse<User> | null> {
    const { page = 1, limit = 10, search, role, applyingupgrade } = params;
    const query: any = {
      role: { $ne: 'ADMIN' }, // always exclude admin
    };

    if (role) {
      query.role = role;
    }

    if (applyingupgrade) {
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
    if (!user) return null;
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
    console.log('id evide vannooo just', id);

    const query: any = {
      userId: id, // always exclude admin
    };
    if (search) {
      query.$or = [{ email: { $regex: search, $options: 'i' } }];
    }
    const manager = await EventManagerModel.findOne(query);

    if (!manager) return null;

    return new EventManager(
      manager._id.toString(),
      manager.userId.toString(),
      manager.aboutEvents,
      manager.experienceLevel,
      manager.fullName,
      manager.organizationName,
      manager.certificate,
      manager.documentReference,
      manager.socialLinks,
      manager.organizationType,
    );
  }
}
