export interface IGetMyBookingUseCase{
    execute(userId:string,page:number,limit:number):Promise<any>
}