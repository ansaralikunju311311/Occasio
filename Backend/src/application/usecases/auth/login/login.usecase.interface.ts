import type { LoginDto } from '../../../../application/dtos/login.dto';
import type { LoginResponseDto } from '../../../../application/dtos/loginResponse.dto';

export interface ILoginUsecase {
  execute(data: LoginDto): Promise<LoginResponseDto>;
}
