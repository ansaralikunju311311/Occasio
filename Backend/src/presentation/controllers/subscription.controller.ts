import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { catchAsync } from '../../common/utils/catchAsync';
import type { ICreatePlanUseCase } from '../../application/usecases/subscription/createPlan/createplan.usecase.interface';
import type { IGetPlansUseCase } from '../../application/usecases/subscription/getPlan/getplan.usecase.interface';
import type { IUpdatePlanUseCase } from '../../application/usecases/subscription/updateplan/updateplan.usecase.interface';
import { sendSuccess } from '../../common/utils/response';
import { SubscriptionDtoMapper } from '../../common/mappers/subscription-dto.mapper';

export class PlanController {
  constructor(
    private _createPlansUseCase: ICreatePlanUseCase,
    private _getPlansUseCase: IGetPlansUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
  ) {}

  createPlans = catchAsync(async (req: Request, res: Response) => {
    const dto = SubscriptionDtoMapper.fromRequest(req.body);
    const plans = await this._createPlansUseCase.execute(dto);
    sendSuccess(res, plans, undefined, HttpStatus.OK, { plans });
  });

  getPlans = catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const { plans, total } = await this._getPlansUseCase.execute({
      page,
      limit,
    });

    const extra: Record<string, unknown> = { plans };
    if (page !== undefined && limit !== undefined) {
      extra.metadata = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    sendSuccess(res, plans, undefined, HttpStatus.OK, extra);
  });

  updatePlan = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const dto = SubscriptionDtoMapper.toUpdateDto(req.body);
    const plan = await this._updatePlanUseCase.execute(id, dto);
    sendSuccess(res, plan, undefined, HttpStatus.OK, { plan });
  });
}
