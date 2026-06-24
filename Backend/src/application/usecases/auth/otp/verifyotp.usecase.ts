import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IOtpRepository } from '../../../../domain/repositories/otp.repository.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import type { VerfiyOtpDto } from '../../../dtos/verifyotp.dto';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import type { ITokenService } from '../../../../domain/services/token.service.interface';
// import { CreateToken } from "common/services/token.service";
import type { LoginResponseDto } from '../../../dtos/loginResponse.dto';
import { ErrorMessage } from '../../../../common/enums/message-enum';

import type { IVerifyOtpUseCase } from './verifyotp.usecase.interface';
export class VerifyUseCase implements IVerifyOtpUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _otpRepository: IOtpRepository,
    private _tokenService: ITokenService,
  ) {}

  async execute(data: VerfiyOtpDto): Promise<LoginResponseDto> {
    const user = await this._userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = await this._otpRepository.MatchOTP(data);

    if (!otp) {
      throw new Error('no user and otp');
    }

    if (!otp.otp || !otp.otpExpires) {
      throw new AppError(ErrorMessage.NO_OTP_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (otp.otp !== data.otp) {
      throw new AppError(ErrorMessage.INCORRECT_OTP, HttpStatus.UNAUTHORIZED);
    }
    if (otp.otpExpires < new Date()) {
      //    await this._userRepository.updateUser(user)
      throw new AppError(ErrorMessage.OTP_EXPIRED, HttpStatus.GONE);
    }

    otp.isUsed = true;
    user.isVerified = true;

    const updateUser = await this._userRepository.updateUser(user);

    const accessToken = this._tokenService.generateAccessToken({
      userId: updateUser.id,
      role: updateUser.role,
    });
    const refreshToken = this._tokenService.generateRefreshToken({
      userId: updateUser.id,
      role: updateUser.role,
    });

    return {
      user: userMapper.toResponse(updateUser),
      accessToken,
      refreshToken,
    };
  }
}
