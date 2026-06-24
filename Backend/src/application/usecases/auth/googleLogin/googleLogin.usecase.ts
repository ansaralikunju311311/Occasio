import type { ITokenService } from '../../../../domain/services/token.service.interface';

import type { IGoogleLoginUseCase } from './googleLogin.usecase.interface';

export class GoogleLogin implements IGoogleLoginUseCase {
  constructor(private _tokenService: ITokenService) {}

  async execute(
    userId: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this._tokenService.generateAccessToken({
      userId,
      role,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userId,
      role,
    });

    return {
      refreshToken,
      accessToken,
    };
  }
}
