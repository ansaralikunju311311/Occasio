import type { OTP } from '../../domain/entities/otp.entity';
import type { OtpResponseDto } from '../../application/dtos/responses/otp-response.dto';

import { BaseMapper } from './base.mapper';

export class OtpMapper extends BaseMapper<OTP, OtpResponseDto> {
  toResponse(entity: OTP): OtpResponseDto {
    return {
      email: entity.email,
      otpExpires: entity.otpExpires,
      otpType: entity.otpType,
      isUsed: entity.isUsed,
      otpSendAt: entity.otpSendAt,
    };
  }
}

export const otpMapper = new OtpMapper();
