export class Subscription {
  constructor(
    public readonly id: string | null,

    public name: string,
    public price: number,
    public eventLimit: number,
    public commissionPercentage: number,
    public features: string[],
    public isActive: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

