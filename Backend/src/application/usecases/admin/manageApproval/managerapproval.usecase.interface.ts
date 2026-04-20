import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface IApprovalUseCase {
  execute(id: string): Promise<UserResponseDto | null>;
}
