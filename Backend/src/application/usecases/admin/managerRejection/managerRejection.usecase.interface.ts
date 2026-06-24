import type { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IManagerRejectionUseCase {
  execute(id: string, reason?: string): Promise<UserResponseDto | null>;
}
