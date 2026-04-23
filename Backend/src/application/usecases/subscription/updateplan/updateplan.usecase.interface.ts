import { CreatePlanDto } from "../../../dtos/createplan.dto";
import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto";

export interface IUpdatePlanUseCase {
  execute(id: string, data: Partial<CreatePlanDto>): Promise<ResponsePlanDto | null>;
}
