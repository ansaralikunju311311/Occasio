import type { CreatePlanDto } from '../../../dtos/createplan.dto';
import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';
export interface ICreatePlanUseCase {
  execute(data: CreatePlanDto): Promise<ResponsePlanDto | null>;
}
