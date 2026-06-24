import type { VerifySubscriptionPaymentDto } from '../../../../application/dtos/verify-subscription-payment.dto';

export interface IVerifySubscriptionPaymentUseCase {
  execute(
    data: VerifySubscriptionPaymentDto,
    userId: string,
  ): Promise<Record<string, unknown>>;
}
