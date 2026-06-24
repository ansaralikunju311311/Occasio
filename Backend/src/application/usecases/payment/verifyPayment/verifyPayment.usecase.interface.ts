import type { VerifyPaymentDto } from '../../../../application/dtos/verify-payment.dto';

export interface IVerifyPaymentUseCase {
  execute(
    data: VerifyPaymentDto,
    userId: string,
  ): Promise<Record<string, unknown>>;
}
