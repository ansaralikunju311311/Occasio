import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { catchAsync } from '../../common/utils/catchAsync';
import { ICreatePlanUseCase } from '../../application/usecases/subscription/createPlan/createplan.usecase.interface';
import { IGetPlansUseCase } from '../../application/usecases/subscription/getPlan/getplan.usecase.interface';
import { IUpdatePlanUseCase } from '../../application/usecases/subscription/updateplan/updateplan.usecase.interface';

export class PlanController {
  constructor(
    private createPlansUseCase: ICreatePlanUseCase,
    private getPlansUseCase: IGetPlansUseCase,
    private updatePlanUseCase: IUpdatePlanUseCase
  ) {}

  createPlans = catchAsync(async (req: Request, res: Response) => {
    console.log("data", req.body);
    const plans = await this.createPlansUseCase.execute(req.body);
    res.status(HttpStatus.OK).json({
      plans,
    });
  });

  getPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await this.getPlansUseCase.execute();
    res.status(HttpStatus.OK).json({
      plans,
    });
  });

  updatePlan = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const plan = await this.updatePlanUseCase.execute(id, req.body);
    res.status(HttpStatus.OK).json({
      plan,
    });
  });
}
