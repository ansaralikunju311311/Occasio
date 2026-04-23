import { PlanType } from "../../common/enums/plan-enum";
export class Subscription{
    constructor(
         public readonly id: string | null,
        
            public name: PlanType,
            public price: number,
            public eventLimit: number,
            public commissionPercentage: number,
            public features: string[],
            public isActive: boolean,
            public createdAt?: Date,
            public updatedAt?: Date,
    ){}
}