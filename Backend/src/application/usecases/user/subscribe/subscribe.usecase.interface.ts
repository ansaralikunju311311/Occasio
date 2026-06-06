import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
export interface ISubscribeUseCase {
  execute(userId: string,planId:string): Promise<UserResponseDto | null>;
}
