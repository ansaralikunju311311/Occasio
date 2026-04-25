import { ICreateOrderUseCase } from './createOrder.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private paymentGateway: IPaymentGateway,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, userId: string, amount?: number): Promise<any> {
    if (!amount) {
      
      await this.eventRepository.validateOwnershipAndDraft(eventId, userId);
      
      return await this.paymentGateway.createOrder(eventId, 99);
    } else {
      return await this.paymentGateway.createOrder(eventId, amount);
    }
  }
}
