import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IReapplyUseCase {
  execute(data: string): Promise<UserResponseDto | null>;
}
