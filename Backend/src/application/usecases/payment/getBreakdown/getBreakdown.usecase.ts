import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';

export interface IGetBreakdownUseCase {
  execute(eventId: string, amount: number): Promise<any>;
}

export class GetBreakdownUseCase implements IGetBreakdownUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(eventId: string, amount: number): Promise<any> {
    const event = await this.eventRepository.findByIdEvents(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const creatorId = event.createdBy;
    const creator = await this.userRepository.findByIdUser(creatorId);
    if (!creator) {
      throw new Error('Event creator not found');
    }

    let commissionPercentage = 10; // Default 10% commission if no active subscription
    let planName = 'No Subscription';

    if (creator.activeSubscription) {
      const plan = await this.subscriptionRepository.findPlanById(creator.activeSubscription);
      if (plan) {
        commissionPercentage = plan.commissionPercentage;
        planName = plan.name;
      }
    }

    const commissionAmount = parseFloat((amount * (commissionPercentage / 100)).toFixed(2));
    const totalAmount = amount;
    const organizerRevenue = parseFloat((amount - commissionAmount).toFixed(2));

    return {
      eventId,
      eventTitle: event.title,
      basePrice: event.price,
      totalAmount,
      commissionPercentage,
      commissionAmount,
      organizerRevenue,
      planName,
    };
  }
}
