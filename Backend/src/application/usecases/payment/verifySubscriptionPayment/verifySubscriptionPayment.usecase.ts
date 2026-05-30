import { IVerifySubscriptionPaymentUseCase } from './verifySubscriptionPayment.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';

export class VerifySubscriptionPaymentUseCase implements IVerifySubscriptionPaymentUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private userRepository: IUserRepository,
    private paymentRepository: IPaymentRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planId: string;
    },
    userId: string
  ): Promise<any> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = data;

    const isValid = this.paymentGateway.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    const user = await this.userRepository.findByIdUser(userId);
    if (!user) throw new Error('User not found');

    const targetPlan = await this.subscriptionRepository.findPlanById(planId);
    if (!targetPlan) throw new Error('Target plan not found');

    // Prevent downgrade again just in case (someone bypasses the order creation)
    if (user.activeSubscription) {
      const currentPlan = await this.subscriptionRepository.findPlanById(user.activeSubscription);
      if (currentPlan) {
        if (targetPlan.price < currentPlan.price) {
          throw new Error('You cannot downgrade to a lower tier plan.');
        }
      }
    }

    // 1. Assign new subscription and reset eventsCreated
    user.activeSubscription = planId;
    user.eventsCreated = 0;
    await this.userRepository.updateUser(user);

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
      new Date()
    );

    await this.paymentRepository.savePayment(payment);

    return {
      success: true,
      message: 'Subscription upgraded successfully',
    };
  }
}
