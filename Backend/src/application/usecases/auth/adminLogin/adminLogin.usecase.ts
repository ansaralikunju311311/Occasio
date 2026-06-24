import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { IHashServive } from '../../../../domain/services/hash.service.interface';
import { userMapper } from '../../../../common/mappers/user.mapper';
import { HttpStatus } from '../../../../common/constants/http-status';
import { AppError } from '../../../../common/errors/apperror';
import { UserStatus } from '../../../../common/enums/userstatus-enum';
import { UserRole } from '../../../../common/enums/userrole-enum';
// import { AdminLoginDto } from "../../dtos/adminlogin.dto";
import type { LoginDto } from '../../../../application/dtos/login.dto';
import type { LoginResponseDto } from '../../../dtos/loginResponse.dto';
import type { ITokenService } from '../../../../domain/services/token.service.interface';
import { ErrorMessage } from '../../../../common/enums/message-enum';
import type { ILoginUsecase } from '../login/login.usecase.interface';
export class AdminLoginUseCase implements ILoginUsecase {
  constructor(
    private _userRepository: IUserRepository,
    private _compareService: IHashServive,
    private _tokenService: ITokenService,
  ) {}

  async execute(data: LoginDto): Promise<LoginResponseDto> {
    //    console.log(data.role)
    const user = await this._userRepository.findByEmail(data.email);

    //    console.log(value)
    if (!user) {
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.role !== UserRole.ADMIN) {
      throw new AppError(
        ErrorMessage.NO_PERMISSION_ADMIN,
        HttpStatus.UNAUTHORIZED,
      );
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

    // console.log("refresf",refreshToken);
    // console.log("access",accessToken)

    return {
      user: userMapper.toResponse(user),
      accessToken,
      refreshToken,
    };
  }
}
