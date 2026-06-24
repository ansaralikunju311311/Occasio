import { SeatModel } from '../../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import { IFailBookingUseCase } from './fail-booking.usecase.interface';
import { ISeatRepository } from '../../../../domain/repositories/seats/seat.repository.interface';

export class FailBookingUseCase implements IFailBookingUseCase{
  constructor(
        private _seatRepository: ISeatRepository
  ){}
  async execute(userId: string, seatIds: string[]):Promise<number> {
    const result = await this._seatRepository.releaseSeats(seatIds)

    return result
  }
}
