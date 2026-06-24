import type { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import type { ManagerPlan } from '../../../../common/enums/manager-plan.enum';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';

import type { IVerifySubscriptionPaymentUseCase } from './verifySubscriptionPayment.usecase.interface';

export class VerifySubscriptionPaymentUseCase implements IVerifySubscriptionPaymentUseCase {
  constructor(
    private _paymentGateway: IPaymentGateway,
    private _userRepository: IUserRepository,
    private _paymentRepository: IPaymentRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _managerSubscriptionRepository: IManagerSubscriptionRepository,
  ) {}

  async execute(
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planId: string;
    },
    userId: string,
  ): Promise<Record<string, unknown>> {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = data;

    const isValid = this._paymentGateway.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const targetPlan = await this._subscriptionRepository.findPlanById(planId);
    if (!targetPlan) {
      throw new Error('Target plan not found');
    }

    // Prevent downgrade
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

        // 1. Assign new subscription details and reset eventsUsed
        managerSub.plan = targetPlan.name as unknown as ManagerPlan;
        managerSub.eventLimit = targetPlan.eventLimit;
        managerSub.eventsUsed = 0;
        managerSub.startDate = new Date();
        const endDate = new Date(managerSub.startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        managerSub.endDate = endDate;

        await this._managerSubscriptionRepository.update(
          managerSub.id as string,
          {
            plan: managerSub.plan,
            eventLimit: managerSub.eventLimit,
            eventsUsed: managerSub.eventsUsed,
            startDate: managerSub.startDate,
            endDate: managerSub.endDate,
          },
        );
      } else {
        throw new Error('Manager Subscription not found.');
      }
    } else {
      throw new Error('No active subscription found to upgrade.');
    }

    user.eventsCreated = 0;
    await this._userRepository.updateUser(user);

    // 3. Create a payment record
    const payment = new Payment(
      null,
      userId,
      PaymentPurpose.SUBSCRIPTION,
      targetPlan.price,
      'INR',
      PaymentMethod.RAZORPAY,
      PaymentStatus.SUCCESS,
      razorpay_payment_id,
      undefined,
      undefined,
      new Date(),
    );

    await this._paymentRepository.savePayment(payment);

    return {
      success: true,
      message: 'Subscription upgraded successfully',
    };
  }
}
