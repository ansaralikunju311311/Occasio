import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';

export interface IGetPlansUseCase {
  execute(params?: { page?: number; limit?: number }): Promise<{ plans: ResponsePlanDto[]; total: number }>;
}
