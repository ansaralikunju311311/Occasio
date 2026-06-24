import { IGetMyBookingUseCase } from "./getmybooking.usecase.interface";
import { IBookingRepository } from "../../../../domain/repositories/booking/booking.repository.interface";

export class GetMyBookingUseCase implements IGetMyBookingUseCase{
    constructor(
            private _bookingRepository:IBookingRepository
        ){}
   async execute(userId: string, page: number, limit: number){
        
    return this._bookingRepository.getBookingsByUser(userId,{page,limit})
    }
}