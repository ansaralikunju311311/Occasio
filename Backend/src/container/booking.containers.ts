import { LockSeatsUseCase } from "../application/usecases/booking/lockseats/lock-seats.usecase"
import { MockPaymentUseCase } from "../application/usecases/booking/mockpayment/mock-payment.usecase";
import { ConfirmBookingUseCase } from "../application/usecases/booking/confirmbooking/confirm-booking.usecase";
import { FailBookingUseCase } from "../application/usecases/booking/bookingfailed/fail-booking.usecase";
import { EventRepository } from "../infrastructure/repositories/event/event.repository";
import { SeatRepository } from "../infrastructure/repositories/seatrepo/seat.repository";
import { BookingRepository } from "../infrastructure/repositories/booking/booking.repository";
import { QrCode } from "../common/services/qrcode.service";
import { BookingController } from "../presentation/controllers/booking.controller";
import { MongoTransactionManager } from "../infrastructure/services/mongotransation.service";
export const makebookingController =()=>{


        const eventRepository = new EventRepository()
        const seatRepository = new SeatRepository()
        const bookingRepository = new BookingRepository()
        const qrCode = new QrCode()

        const transactionManager = new MongoTransactionManager()







    const lockSeatsUseCase = new LockSeatsUseCase(eventRepository,seatRepository);
    const mockPaymentUseCase = new MockPaymentUseCase()
    const confirmBookingUseCase = new ConfirmBookingUseCase(bookingRepository,seatRepository,qrCode,transactionManager);
    const failBookingUseCase = new FailBookingUseCase(seatRepository)


    return new BookingController(
        lockSeatsUseCase,
        mockPaymentUseCase,
        confirmBookingUseCase,
        failBookingUseCase
    )
}