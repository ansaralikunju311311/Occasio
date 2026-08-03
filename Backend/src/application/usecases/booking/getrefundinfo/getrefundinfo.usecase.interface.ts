import type { RefundInfoResult } from '../../../../domain/repositories/booking/booking.repository.interface';

export interface IGetRefundInfoUseCase {
  execute(bookingId: string, userId: string): Promise<RefundInfoResult>;
}
