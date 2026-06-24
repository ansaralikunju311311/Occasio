export interface IGetManagerBookingUseCase{
    execute(userId:string,page:number,limit:number):Promise<any>
}