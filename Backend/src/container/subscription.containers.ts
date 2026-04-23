import { CreatePlanUseCase } from "../application/usecases/subscription/createPlan/createplan.usecase";
import { SubscriptionRepository } from "../infrastructure/repositories/subscription/subscription.repository";
import { PlanController } from "../presentation/controllers/subscription.controller";

import { GetPlansUseCase } from "../application/usecases/subscription/getPlan/getplan.usecase";
import { UpdatePlanUseCase } from "../application/usecases/subscription/updateplan/updateplan.usecase";

export const makePlanController = () => {
  const subscriptionRepository = new SubscriptionRepository();
  const createPlanUseCase = new CreatePlanUseCase(subscriptionRepository);
  const getPlansUseCase = new GetPlansUseCase(subscriptionRepository);
  const updatePlanUseCase = new UpdatePlanUseCase(subscriptionRepository);
  return new PlanController(createPlanUseCase, getPlansUseCase, updatePlanUseCase);
};
