export interface IGoogleLoginUseCase{
     execute(userId:string,role:string):Promise<{accessToken:string,refreshToken:string}>;
}