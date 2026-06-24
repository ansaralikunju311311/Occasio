export interface ILockSeatsUseCase{
    execute(userId: string, eventId: string, seatIds: string[]):Promise<any>
}