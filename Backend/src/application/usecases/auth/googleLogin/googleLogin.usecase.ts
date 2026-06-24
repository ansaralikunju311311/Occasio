import { ITokenService } from "../../../../domain/services/token.service.interface";
import { IGoogleLoginUseCase } from "./googleLogin.usecase.interface";

export class GoogleLogin implements IGoogleLoginUseCase
{
    constructor(
     private tokenService : ITokenService
    ){}


    async execute(userId: string, role: string): Promise<{ accessToken: string; refreshToken: string; }> {
       
          const accessToken =  this.tokenService.generateAccessToken({
            userId,
            role

          })



          const refreshToken =  this.tokenService.generateRefreshToken({
            userId,role
          })


          return{
            refreshToken,
            accessToken
          }

    }
}