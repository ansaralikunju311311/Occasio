import { ICreateSubscriptionOrderUseCase } from './createSubscriptionOrder.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';

export class CreateSubscriptionOrderUseCase implements ICreateSubscriptionOrderUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private managerSubscriptionRepository: IManagerSubscriptionRepository
  ) {}

  async execute(userId: string, planId: string): Promise<any> {
    const user = await this.userRepository.findByIdUser(userId);
    if (!user) throw new Error('User not found');

    const targetPlan = await this.subscriptionRepository.findPlanById(planId);
    if (!targetPlan) throw new Error('Target plan not found');

    // Downgrade Prevention Logic
    if (user.activeSubscription) {
      const managerSub = await this.managerSubscriptionRepository.findById(user.activeSubscription);
      if (managerSub) {
        const currentPlanDef = await this.subscriptionRepository.findPlanByName(managerSub.plan);
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
      const order = await this.paymentGateway.createOrder(targetPlan.id?.toString() || planId, targetPlan.price, 'subscription');
      return order;
    } catch (error: any) {
      console.error("Razorpay order creation failed:", error);
      throw new Error(`Payment Gateway Error: ${error.message || 'Could not create order'}`);
    }
  }
}
