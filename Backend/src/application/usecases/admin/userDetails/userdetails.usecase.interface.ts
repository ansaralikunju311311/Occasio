import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IUserdetailsUseCase {
  execute(id: string): Promise<UserResponseDto | null>;
}
