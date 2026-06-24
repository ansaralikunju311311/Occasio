import type { ISeatRepository } from '../../../../domain/repositories/seats/seat.repository.interface';

import type { IFailBookingUseCase } from './fail-booking.usecase.interface';

export class FailBookingUseCase implements IFailBookingUseCase {
  constructor(private _seatRepository: ISeatRepository) {}
  async execute(userId: string, seatIds: string[]): Promise<number> {
    const result = await this._seatRepository.releaseSeats(seatIds);

    return result;
  }
}
