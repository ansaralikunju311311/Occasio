import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { UserRole } from '../../../../common/enums/userrole-enum';
import { EmailSerive } from '../../../../common/services/email.service';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import { IApprovalUseCase } from './managerapproval.usecase.interface';
import mongoose from 'mongoose';
import { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../../domain/entities/manager-subscription.entity';
import { ManagerPlan } from '../../../../common/enums/manager-plan.enum';
import { ManagerSubscriptionStatus } from '../../../../common/enums/manager-subscription-status.enum';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { PlanType } from '../../../../common/enums/plan-enum';
export class ManagerApprovalUseCase implements IApprovalUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailSerive,
    private managerSubscriptionRepository: IManagerSubscriptionRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByIdUser(id);
    console.log(user);

    if (!user) return null;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const freePlan = await this.subscriptionRepository.findPlanByName(PlanType.FREE);
      const eventLimit = freePlan ? freePlan.eventLimit : 2;

      const startDate = new Date();
      
      const newSubscription = new ManagerSubscription(
        null,
        user.id as string,
        ManagerPlan.FREE,
        ManagerSubscriptionStatus.ACTIVE,
        eventLimit, 
        0, 
        startDate
      );

      const createdSubscription = await this.managerSubscriptionRepository.create(newSubscription, session);

      user.role = UserRole.EVENT_MANAGER;
      user.rejectedAt = null;
      user.applyingupgrade = UpgradeStatus.APPROVED;
      user.activeSubscription = createdSubscription.id;
      
      const updatedUser = await this.userRepository.updateUser(user, session);

      await session.commitTransaction();

      if (updatedUser) {
        await this.emailService.sendApprovalEmail(
          updatedUser.email,
          updatedUser.name,
        );
      }

      return updatedUser ? userMapper.toResponse(updatedUser) : null;
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction aborted due to error:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
