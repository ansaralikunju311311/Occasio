import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IHashServive } from '../../../../domain/services/hash.service.interface';
import type { signupDTO } from '../../../dtos/signup.dto';
import { User } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../common/enums/userrole-enum';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { generateOTP } from '../../../../common/utils/generateotp';
import { AppError } from '../../../../common/errors/apperror';
import { HttpStatus } from '../../../../common/constants/http-status';
import type { EmailSerive } from '../../../../common/services/email.service';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import { otpMapper } from '../../../../common/mappers/otp.mapper';
import { OTP } from '../../../../domain/entities/otp.entity';
import type { OtpResponseDto } from '../../../../application/dtos/responses/otp-response.dto';
import { UserOtp } from '../../../../common/enums/userotp-enum';
import type { IOtpRepository } from '../../../../domain/repositories/otp.repository.interface';

import type { ISignupUseCase } from './signup.usecase.interface';
export class SignupUsecase implements ISignupUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IHashServive,
    private _emailService: EmailSerive,
    private _otpRespository: IOtpRepository,
  ) {}

  async execute(data: signupDTO): Promise<OtpResponseDto | null> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new AppError(
          ErrorMessage.USER_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
    }
    if (data.confirmpassword !== data.password) {
      throw new AppError(
        ErrorMessage.PASSWORD_MISMATCH,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashpassword = await this._hashService.hash(data.password);
    const role: UserRole = UserRole.USER;
    const applyingupgrade = UpgradeStatus.NONE;
    // const isEventManger = false;
    const isVerified = false;
    const rejectedAt = null;
    const reapplyAt = null;
    const otpSendAt = new Date();

    const otp = generateOTP();

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const isUsed = false;
    await this._emailService.sendOtpEmail(data.email, otp);

    //   email:string,
    //    otp:string,
    //    otpType:UserOtp,
    //    otpExpires:Date,
    //    isUsed:boolean,
    //    otpSendAt:Date

    const Otp = new OTP(
      null,
      data.email,
      otp,
      otpExpires,
      UserOtp.SIGNUP,
      isUsed,
      otpSendAt,
    );

    const newUser = new User(
      existingUser ? existingUser.id : null,
      data.name,
      data.email,
      hashpassword,
      role,
      UserStatus.ACTIVE,
      isVerified,
      // otp,
      // otpExpires,
      // UserOtp.SIGNUP,
      // otpSendAt,
      applyingupgrade,
      rejectedAt,
      reapplyAt,
    );

    if (existingUser && !existingUser.isVerified) {
      await this._userRepository.updateUser(newUser);
    } else {
      await this._userRepository.createUser(newUser);
    }

    const otpDetails = await this._otpRespository.otpStore(Otp);

    return otpDetails ? otpMapper.toResponse(otpDetails) : null;
  }
}
