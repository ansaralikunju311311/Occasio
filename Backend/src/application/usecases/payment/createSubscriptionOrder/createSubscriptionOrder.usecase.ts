import type { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import { logger } from '../../../../common/logger/logger';

import type { ICreateSubscriptionOrderUseCase } from './createSubscriptionOrder.usecase.interface';

export class CreateSubscriptionOrderUseCase implements ICreateSubscriptionOrderUseCase {
  constructor(
    private _paymentGateway: IPaymentGateway,
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _managerSubscriptionRepository: IManagerSubscriptionRepository,
  ) {}

  async execute(userId: string, planId: string): Promise<unknown> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const targetPlan = await this._subscriptionRepository.findPlanById(planId);
    if (!targetPlan) {
      throw new Error('Target plan not found');
    }

    // Downgrade Prevention Logic
    if (user.activeSubscription) {
      const managerSub = await this._managerSubscriptionRepository.findById(
        user.activeSubscription,
      );
      if (managerSub) {
        const currentPlanDef =
          await this._subscriptionRepository.findPlanByName(managerSub.plan);
        if (currentPlanDef && targetPlan.price < currentPlanDef.price) {
          throw new Error('You cannot downgrade to a lower tier plan.');
        }
      }
    }

    if (targetPlan.price <= 0) {
      throw new Error('This plan is free and does not require payment.');
    }

    // Generate Razorpay Order
    try {
      const order = await this._paymentGateway.createOrder(
        targetPlan.id?.toString() || planId,
        targetPlan.price,
        'subscription',
      );
      return order;
    } catch (error: unknown) {
      logger.error('Razorpay order creation failed:', error);
      throw new Error(
        `Payment Gateway Error: ${error instanceof Error ? error.message : 'Could not create order'}`,
      );
    }
  }
}
