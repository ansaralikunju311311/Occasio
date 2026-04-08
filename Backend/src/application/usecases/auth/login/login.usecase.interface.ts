import { LoginDto } from '../../../../application/dtos/login.dto';
import { LoginResponseDto } from '../../../../application/dtos/loginResponse.dto';

export interface ILoginUsecase {
  execute(data: LoginDto): Promise<LoginResponseDto | null>;
}
