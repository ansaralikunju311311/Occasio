import { ICreateSubscriptionOrderUseCase } from './createSubscriptionOrder.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';

export class CreateSubscriptionOrderUseCase implements ICreateSubscriptionOrderUseCase {
  constructor(
    private _paymentGateway: IPaymentGateway,
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _managerSubscriptionRepository: IManagerSubscriptionRepository
  ) {}

  async execute(userId: string, planId: string): Promise<any> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user) throw new Error('User not found');

    const targetPlan = await this._subscriptionRepository.findPlanById(planId);
    if (!targetPlan) throw new Error('Target plan not found');

    // Downgrade Prevention Logic
    if (user.activeSubscription) {
      const managerSub = await this._managerSubscriptionRepository.findById(user.activeSubscription);
      if (managerSub) {
        const currentPlanDef = await this._subscriptionRepository.findPlanByName(managerSub.plan);
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
      const order = await this._paymentGateway.createOrder(targetPlan.id?.toString() || planId, targetPlan.price, 'subscription');
      return order;
    } catch (error: any) {
      console.error("Razorpay order creation failed:", error);
      throw new Error(`Payment Gateway Error: ${error.message || 'Could not create order'}`);
    }
  }
}
