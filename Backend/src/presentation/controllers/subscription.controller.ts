import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { catchAsync } from '../../common/utils/catchAsync';
import type { ICreatePlanUseCase } from '../../application/usecases/subscription/createPlan/createplan.usecase.interface';
import type { IGetPlansUseCase } from '../../application/usecases/subscription/getPlan/getplan.usecase.interface';
import type { IUpdatePlanUseCase } from '../../application/usecases/subscription/updateplan/updateplan.usecase.interface';

export class PlanController {
  constructor(
    private _createPlansUseCase: ICreatePlanUseCase,
    private _getPlansUseCase: IGetPlansUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
  ) {}

  createPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await this._createPlansUseCase.execute(req.body);
    res.status(HttpStatus.OK).json({
      plans,
    });
  });

  getPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await this._getPlansUseCase.execute();
    res.status(HttpStatus.OK).json({
      plans,
    });
  });

  updatePlan = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const plan = await this._updatePlanUseCase.execute(id, req.body);
    res.status(HttpStatus.OK).json({
      plan,
    });
  });
}
