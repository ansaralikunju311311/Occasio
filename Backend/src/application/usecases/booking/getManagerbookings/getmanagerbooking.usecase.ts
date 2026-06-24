import type { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';

import type { IGetManagerBookingUseCase } from './getmanagerbooking.usecase.interface';

export class GetManagerBookingUseCase implements IGetManagerBookingUseCase {
  constructor(private _bookingRepository: IBookingRepository) {}
  async execute(managerId: string, page: number, limit: number) {
    return this._bookingRepository.getManagerBookings(managerId, {
      page,
      limit,
    });
  }
}
