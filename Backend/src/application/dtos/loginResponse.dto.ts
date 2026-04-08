import { User } from '../../domain/entities/user.entity';

export interface LoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
