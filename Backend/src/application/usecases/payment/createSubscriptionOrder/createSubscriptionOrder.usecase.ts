import { ICreateSubscriptionOrderUseCase } from './createSubscriptionOrder.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';

export class CreateSubscriptionOrderUseCase implements ICreateSubscriptionOrderUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(userId: string, planId: string): Promise<any> {
    const user = await this.userRepository.findByIdUser(userId);
    if (!user) throw new Error('User not found');

    const targetPlan = await this.subscriptionRepository.findPlanById(planId);
    if (!targetPlan) throw new Error('Target plan not found');

    // Downgrade Prevention Logic
    if (user.activeSubscription) {
      const currentPlan = await this.subscriptionRepository.findPlanById(user.activeSubscription);
      if (currentPlan) {
        if (targetPlan.price < currentPlan.price) {
          throw new Error('You cannot downgrade to a lower tier plan.');
        }
      }
    }

    if (targetPlan.price <= 0) {
      throw new Error('This plan is free and does not require payment.');
    }

    // Generate Razorpay Order
    // We pass 'subscription' as the notesType to distinguish this order in the dashboard
    const order = await this.paymentGateway.createOrder(targetPlan.id?.toString() || planId, targetPlan.price, 'subscription');

    return order;
  }
}
