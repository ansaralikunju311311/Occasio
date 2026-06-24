import type { ManagerResponseDto } from '../../../../application/dtos/responses/manager-response.dto';
export interface IManagerDetailsUseCase {
  execute(id: string, search?: string): Promise<ManagerResponseDto | null>;
}
