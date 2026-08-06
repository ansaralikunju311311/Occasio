import type {
  IBookingRepository,
  RefundInfoResult,
} from '../../../../domain/repositories/booking/booking.repository.interface';

import type { IGetRefundInfoUseCase } from './getrefundinfo.usecase.interface';

export class GetRefundInfoUseCase implements IGetRefundInfoUseCase {
  constructor(private _bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, userId: string): Promise<RefundInfoResult> {
    return await this._bookingRepository.getRefundInfo(bookingId, userId);
  }
}
