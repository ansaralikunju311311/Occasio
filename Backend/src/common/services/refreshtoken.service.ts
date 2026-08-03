import type { IRefreshTokenUseCase } from '../interfaces/refresh.interface';
import type { ITokenService } from '../../domain/services/token.service.interface';
import type { AuthUser } from '../type/auth.type';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private _tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<string> {
    const decode = this._tokenService.verifyRefreshToken(
      refreshToken,
    ) as AuthUser;

    const accessToken = this._tokenService.generateAccessToken({
      userId: decode.userId,
      role: decode.role,
    });

    return accessToken;
  }
}
