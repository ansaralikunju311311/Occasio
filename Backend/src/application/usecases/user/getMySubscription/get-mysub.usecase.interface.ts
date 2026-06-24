import { ManagerSubscription } from "../../../../domain/entities/manager-subscription.entity";

export interface IGetMySubscriptionUseCase{
    execute (userId:string):Promise<ManagerSubscription | null>
}