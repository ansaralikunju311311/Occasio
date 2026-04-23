import { CreatePlanDto } from "../../../dtos/createplan.dto"
import { ResponsePlanDto } from "../../../dtos/responses/responseplan.dto"
export interface ICreatePlanUseCase{
      execute(data:CreatePlanDto):Promise<ResponsePlanDto | null>
}