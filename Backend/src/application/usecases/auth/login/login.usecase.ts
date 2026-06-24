import type { IHashServive } from '../../../../domain/services/hash.service.interface';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import type { LoginDto } from '../../../dtos/login.dto';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import type { ITokenService } from '../../../../domain/services/token.service.interface';
import type { LoginResponseDto } from '../../../dtos/loginResponse.dto';
import { ErrorMessage } from '../../../../common/enums/message-enum';

import type { ILoginUsecase } from './login.usecase.interface';
export class LoginUseCase implements ILoginUsecase {
  constructor(
    private _userRepository: IUserRepository,
    private _compareService: IHashServive,
    private _tokenService: ITokenService,
  ) {}

  async execute(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isMatch = await this._compareService.comapre(
      data.password,
      user.password,
    );

    if (!isMatch) {
      throw new AppError(
        ErrorMessage.INCORRECT_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.isVerified === false) {
      throw new AppError(
        ErrorMessage.ACCOUNT_NOT_VERIFIED,
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.status === UserStatus.BLOCK) {
      throw new AppError(ErrorMessage.ACCOUNT_BLOCKED, HttpStatus.UNAUTHORIZED);
    }
    const accessToken = this._tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return {
      user: userMapper.toResponse(user),
      accessToken,
      refreshToken,
    };
  }
}
