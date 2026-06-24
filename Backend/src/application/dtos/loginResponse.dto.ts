import type { UserResponseDto } from './responses/user-response.dto';

export interface LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken?: string;
}
