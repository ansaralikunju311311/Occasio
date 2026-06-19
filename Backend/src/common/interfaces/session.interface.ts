export interface ISessionService{
    setRefreshToken(res:Response,token:string):void,
    clerRefreshToken(res:Response):void
}