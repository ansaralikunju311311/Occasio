import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { catchAsync } from '../../common/utils/catchAsync';
import type { PlanType } from '../../common/enums/plan-enum';
import type { CreatePlanDto } from '../../application/dtos/createplan.dto';
import type { ICreatePlanUseCase } from '../../application/usecases/subscription/createPlan/createplan.usecase.interface';
import type { IGetPlansUseCase } from '../../application/usecases/subscription/getPlan/getplan.usecase.interface';
import type { IUpdatePlanUseCase } from '../../application/usecases/subscription/updateplan/updateplan.usecase.interface';
import { sendSuccess } from '../../common/utils/response';

export class PlanController {
  constructor(
    private _createPlansUseCase: ICreatePlanUseCase,
    private _getPlansUseCase: IGetPlansUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
  ) {}

  createPlans = catchAsync(async (req: Request, res: Response) => {
    const dto: CreatePlanDto = {
      name: req.body.name as PlanType,
      price: Number(req.body.price),
      eventLimit: Number(req.body.eventLimit),
      commissionPercentage: Number(req.body.commissionPercentage),
      features: Array.isArray(req.body.features)
        ? (req.body.features as string[])
        : [],
    };
    const plans = await this._createPlansUseCase.execute(dto);
    sendSuccess(res, plans, undefined, HttpStatus.OK, { plans });
  });

  getPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await this._getPlansUseCase.execute();
    sendSuccess(res, plans, undefined, HttpStatus.OK, { plans });
  });

  updatePlan = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const dto: Partial<CreatePlanDto> = {};
    if (req.body.name !== undefined) {
      dto.name = req.body.name as PlanType;
    }
    if (req.body.price !== undefined) {
      dto.price = Number(req.body.price);
    }
    if (req.body.eventLimit !== undefined) {
      dto.eventLimit = Number(req.body.eventLimit);
    }
    if (req.body.commissionPercentage !== undefined) {
      dto.commissionPercentage = Number(req.body.commissionPercentage);
    }
    if (Array.isArray(req.body.features)) {
      dto.features = req.body.features as string[];
    }
    const plan = await this._updatePlanUseCase.execute(id, dto);
    sendSuccess(res, plan, undefined, HttpStatus.OK, { plan });
  });
}
