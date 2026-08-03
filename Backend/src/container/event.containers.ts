import { EventCretionUseCase } from '../application/usecases/events/eventcreation/eventcreation.usecase';
import { EventController } from '../presentation/controllers/event.controller';
import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { GetEventsUseCase } from '../application/usecases/events/getEvents/getevents.usecase';
import { EventDetailsUseCase } from '../application/usecases/events/eventdetails/eventdetails.usecase';
import { MyEventsUseCase } from '../application/usecases/events/myevents/myevents.usecase';
import { UpdateEventUseCase } from '../application/usecases/events/updatevent/updateevent.usecase';
import { DeleteEventUseCase } from '../application/usecases/events/deleteevent/deleteevent.usecase';
import { StartEventUseCase } from '../application/usecases/events/startevent/startevent.usecase';
import { BookingRepository } from '../infrastructure/repositories/booking/booking.repository';
import { UserRepository } from '../infrastructure/repositories/user/user.repository';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription/subscription.repository';
import { ManagerSubscriptionRepository } from '../infrastructure/repositories/manager-subscription/manager-subscription.repository';
import { PaymentRepository } from '../infrastructure/repositories/payment/payment.repository';
import { MongoTransactionManager } from '../infrastructure/services/mongotransation.service';
import { socketService } from '../infrastructure/services/socket.service';
import { RazorpayGateway } from '../infrastructure/services/payment/razorpay.gateway';

export const MakeEventController = () => {
  const eventRepository = new EventRepository();
  const bookingRepository = new BookingRepository();
  const userRepository = new UserRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const managerSubscriptionRepository = new ManagerSubscriptionRepository();
  const paymentRepository = new PaymentRepository();
  const transactionManager = new MongoTransactionManager();
  const razorpayGateway = new RazorpayGateway();

  const eventCretionUseCase = new EventCretionUseCase(
    eventRepository,
    userRepository,
    subscriptionRepository,
    managerSubscriptionRepository,
    transactionManager,
  );
  const getEventsUseCase = new GetEventsUseCase(eventRepository);
  const myEventsUseCase = new MyEventsUseCase(eventRepository);

  const eventDetailsUseCase = new EventDetailsUseCase(
    eventRepository,
    bookingRepository,
  );
  const updateEventsUseCase = new UpdateEventUseCase(
    eventRepository,
    bookingRepository,
    transactionManager,
  );
  const deleteEventUseCase = new DeleteEventUseCase(
    eventRepository,
    bookingRepository,
    paymentRepository,
    userRepository,
    razorpayGateway,
  );
  const startEventUseCase = new StartEventUseCase(
    eventRepository,
    bookingRepository,
    socketService,
  );

  return new EventController(
    eventCretionUseCase,
    getEventsUseCase,
    eventDetailsUseCase,
    myEventsUseCase,
    updateEventsUseCase,
    deleteEventUseCase,
    startEventUseCase,
  );
};
