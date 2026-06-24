import { IRefreshTokenUseCase } from "../interfaces/refresh.interface"
import { ITokenService } from "../../domain/services/token.service.interface"

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
   constructor(private _tokenService: ITokenService) {}

   async execute(refreshToken: string): Promise<string> {
      const decode = this._tokenService.verifyRefreshToken(refreshToken) as any

      const accessToken = this._tokenService.generateAccessToken({
         userId: decode.userId,
         role: decode.role
      })

      return accessToken
   }
}