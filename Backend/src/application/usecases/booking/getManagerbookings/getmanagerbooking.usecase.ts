import { IBookingRepository } from "../../../../domain/repositories/booking/booking.repository.interface";
import { IGetManagerBookingUseCase } from "./getmanagerbooking.usecase.interface";

export class GetManagerBookingUseCase implements IGetManagerBookingUseCase{
    constructor(
        private bookingRepository:IBookingRepository
    ){}
    async execute(managerId: string, page: number, limit: number) {
         return this.bookingRepository.getManagerBookings(managerId,{page,limit})
    }
}