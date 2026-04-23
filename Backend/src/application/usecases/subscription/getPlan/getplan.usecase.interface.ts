import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto";

export interface IGetPlansUseCase {
  execute(): Promise<ResponsePlanDto[]>;
}
