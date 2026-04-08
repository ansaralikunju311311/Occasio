import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { IOtpRepository } from '../../../../domain/repositories/otp.repository.interface';
import { VerfiyOtpDto } from '../../../dtos/verifyotp.dto';

import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import { ITokenService } from '../../../../domain/services/token.service.interface';
// import { CreateToken } from "common/services/token.service";
import { LoginResponseDto } from '../../../dtos/loginResponse.dto';
import { IVerifyOtpUseCase } from './verifyotp.usecase.interface';
import { ErrorMessage } from '../../../../common/enums/message-enum';
export class VerifyUseCase implements IVerifyOtpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private tokenService: ITokenService,
  ) {}

  async execute(data: VerfiyOtpDto): Promise<LoginResponseDto> {
    console.log('body daata for the otp verifction', data);

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = await this.otpRepository.MatchOTP(data);

    if (!otp) {
      throw new Error('no user and otp');
    }
    console.log('fjnjfnvfj', user);

    if (!otp.otp || !otp.otpExpires) {
      throw new AppError(ErrorMessage.NO_OTP_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (otp.otp != data.otp) {
      throw new AppError(ErrorMessage.INCORRECT_OTP, HttpStatus.UNAUTHORIZED);
    }
    if (otp.otpExpires < new Date()) {
      //    await this.userRepository.updateUser(user)
      throw new AppError(ErrorMessage.OTP_EXPIRED, HttpStatus.GONE);
    }

    otp.isUsed = true;
    ((user.isVerified = true),
      // user.otp = null,
      // user.otpExpires = null,
      // user.otpType = null,
      // user.otpSendAt = null

      console.log('the passing value for the updation after the otp', user));
    console.log(user.isVerified);

    3;
    const updateUser = await this.userRepository.updateUser(user);

    const accessToken = this.tokenService.generateAccessToken({
      userId: updateUser.id,
      role: updateUser.role,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: updateUser.id,
      role: updateUser.role,
    });

    return { user: updateUser, accessToken, refreshToken };
    //    accessToken,
    //    refreshToken
  }
}
