import type { CreatePlanDto } from '../../../dtos/createplan.dto';
import type { ResponsePlanDto } from '../../../dtos/responses/responseplan.dto';

export interface IUpdatePlanUseCase {
  execute(
    id: string,
    data: Partial<CreatePlanDto>,
  ): Promise<ResponsePlanDto | null>;
}
