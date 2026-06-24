import { UserOtp } from '../../../../common/enums/userotp-enum';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IHashServive } from '../../../../domain/services/hash.service.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import type { ResetPasswordDTO } from '../../../dtos/reset.dto';
import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import type { IOtpRepository } from '../../../../domain/repositories/otp.repository.interface';

import type { IResetPasswordUseCase } from './reset.usecase.interface';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _userRespository: IUserRepository,
    private _hashService: IHashServive,
    private _otpRepository: IOtpRepository,
  ) {}

  async execute(data: ResetPasswordDTO): Promise<UserResponseDto> {
    const user = await this._userRespository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otpUser = await this._otpRepository.MatchOTP({
      email: data.email,
      otp: data.otp,
    });

    if (!otpUser) {
      throw new AppError(ErrorMessage.INCORRECT_OTP, HttpStatus.UNAUTHORIZED);
    }

    if (otpUser.otpType !== UserOtp.FORGOT_PASSWORD) {
      throw new AppError(
        ErrorMessage.INVALID_PASSWORD_RESET,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!otpUser.otp || !otpUser.otpExpires) {
      throw new AppError(ErrorMessage.NO_OTP_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (otpUser.otp !== data.otp) {
      throw new AppError(ErrorMessage.INCORRECT_OTP, HttpStatus.UNAUTHORIZED);
    }
    if (otpUser.otpExpires < new Date()) {
      throw new AppError(ErrorMessage.OTP_EXPIRED, HttpStatus.GONE);
    }
    if (data.password !== data.confirmpassword) {
      throw new AppError(
        ErrorMessage.PASSWORD_MISMATCH,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedpassword = await this._hashService.hash(data.password);

    user.password = hashedpassword;

    otpUser.isUsed = true;
    await this._otpRepository.otpStore(otpUser);

    const updatedUser = await this._userRespository.updateUser(user);
    return userMapper.toResponse(updatedUser);
  }
}
