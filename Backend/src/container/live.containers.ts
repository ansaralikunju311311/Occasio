import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { BookingRepository } from '../infrastructure/repositories/booking/booking.repository';
import { ChatRepository } from '../infrastructure/repositories/chat/chat.repository';

import { StartLiveUseCase } from '../application/usecases/live/startlive.usecase';
import { EndLiveUseCase } from '../application/usecases/live/endlive.usecase';
import { JoinLiveUseCase } from '../application/usecases/live/joinlive.usecase';
import { SendChatMessageUseCase } from '../application/usecases/live/sendchatmessage.usecase';
import { GetChatHistoryUseCase } from '../application/usecases/live/getchathistory.usecase';

import { LiveController } from '../presentation/controllers/live.controller';

export const MakeLiveController = (): LiveController => {
  const eventRepository = new EventRepository();
  const bookingRepository = new BookingRepository();
  const chatRepository = new ChatRepository();

  const startLiveUseCase = new StartLiveUseCase(eventRepository, bookingRepository);
  const endLiveUseCase = new EndLiveUseCase(eventRepository);
  const joinLiveUseCase = new JoinLiveUseCase(eventRepository, bookingRepository);
  const sendChatMessageUseCase = new SendChatMessageUseCase(
    chatRepository,
    eventRepository,
    bookingRepository,
  );
  const getChatHistoryUseCase = new GetChatHistoryUseCase(
    chatRepository,
    eventRepository,
    bookingRepository,
  );

  return new LiveController(
    startLiveUseCase,
    endLiveUseCase,
    joinLiveUseCase,
    sendChatMessageUseCase,
    getChatHistoryUseCase,
  );
};
