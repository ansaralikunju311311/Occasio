import { IGetMyBookingUseCase } from "./getmybooking.usecase.interface";
import { IBookingRepository } from "../../../../domain/repositories/booking/booking.repository.interface";

export class GetMyBookingUseCase implements IGetMyBookingUseCase{
    constructor(
            private bookingRepository:IBookingRepository
        ){}
   async execute(userId: string, page: number, limit: number){
        
    return this.bookingRepository.getBookingsByUser(userId,{page,limit})
    }
}