import { UserOtp } from '../../../../common/enums/userotp-enum';
import { generateOTP } from '../../../../common/utils/generateotp';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import { EmailSerive } from '../../../../common/services/email.service';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import { otpMapper } from '../../../../common/mappers/otp.mapper';
import { IOtpRepository } from '../../../../domain/repositories/otp.repository.interface';
import { OTP } from '../../../../domain/entities/otp.entity';
import { OtpResponseDto } from '../../../../application/dtos/responses/otp-response.dto';
import { IResendUseCase } from './resend.usecase.interface';

export class ResendotpUseCase implements IResendUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _emailService: EmailSerive,
    private _otpRepository: IOtpRepository,
  ) {}

  async execute(email: string): Promise<OtpResponseDto | null> {
    const user = await this._userRepository.findByEmail(email);

    console.log('user', user);
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    let otpUser = await this._otpRepository.ResendOtp({ email: email });

    const now = new Date();
    console.log('the time now ', now);

    if (otpUser) {
      if (otpUser.isUsed === true) {
        throw new Error('veritied user the ');
      }

      if (otpUser.otpSendAt) {
        const diff = (now.getTime() - otpUser.otpSendAt.getTime()) / 1000;
        console.log('the diff', diff);

        if (diff < 60) {
          throw new AppError(
            ErrorMessage.WAIT_ONE_MINUTE,
            HttpStatus.MANY_REQUEST,
          );
        }
      }
    }

    const newOtp = generateOTP();
    console.log('generated', newOtp);

    let otpType = UserOtp.SIGNUP;
    if (user.isVerified === false) {
      otpType = UserOtp.SIGNUP;
    } else if (user.isVerified === true) {
      otpType = UserOtp.FORGOT_PASSWORD;
    }

    if (!otpUser) {
      otpUser = new OTP(
        null,
        user.email,
        newOtp,
        new Date(now.getTime() + 5 * 60 * 1000),
        otpType,
        false,
        now,
      );
    } else {
      otpUser.isUsed = false;
      otpUser.otp = newOtp;
      otpUser.otpExpires = new Date(now.getTime() + 5 * 60 * 1000);
      otpUser.otpType = otpType;
      otpUser.otpSendAt = now;
    }

    await this._emailService.sendOtpEmail(user.email, newOtp);

    const storedOtp = await this._otpRepository.otpStore(otpUser);
    return storedOtp ? otpMapper.toResponse(storedOtp) : null;
  }
}
