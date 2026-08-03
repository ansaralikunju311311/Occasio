import type { Request, Response } from 'express-serve-static-core';
import { HttpStatus } from '../../common/constants/http-status';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/response';
import type { StartLiveUseCase } from '../../application/usecases/live/startlive.usecase';
import type { EndLiveUseCase } from '../../application/usecases/live/endlive.usecase';
import type { JoinLiveUseCase } from '../../application/usecases/live/joinlive.usecase';
import type { SendChatMessageUseCase } from '../../application/usecases/live/sendchatmessage.usecase';
import type { GetChatHistoryUseCase } from '../../application/usecases/live/getchathistory.usecase';

export class LiveController {
  constructor(
    private _startLiveUseCase: StartLiveUseCase,
    private _endLiveUseCase: EndLiveUseCase,
    private _joinLiveUseCase: JoinLiveUseCase,
    private _sendChatMessageUseCase: SendChatMessageUseCase,
    private _getChatHistoryUseCase: GetChatHistoryUseCase,
  ) {}

  startLive = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const managerId = req.authUser?.userId;
    if (!managerId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this._startLiveUseCase.execute(eventId, managerId);
    sendSuccess(res, result, 'Live event started successfully', HttpStatus.OK, {
      event: result,
    });
  });

  endLive = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const managerId = req.authUser?.userId;
    if (!managerId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this._endLiveUseCase.execute(eventId, managerId);
    sendSuccess(res, result, 'Live event ended successfully', HttpStatus.OK, {
      event: result,
    });
  });

  joinLive = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this._joinLiveUseCase.execute(eventId, userId);
    sendSuccess(res, result, 'Joined live stream verification successful', HttpStatus.OK, {
      liveSession: result,
    });
  });

  sendChatMessage = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const userId = req.authUser?.userId;
    const userName = (req.authUser as any)?.email?.split('@')[0] || (userId ? `User_${userId.substring(0, 5)}` : 'User');
    const userRole = req.authUser?.role || 'USER';

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Message content is required' });
      return;
    }

    const result = await this._sendChatMessageUseCase.execute(
      eventId,
      userId,
      userName,
      userRole,
      message.trim(),
    );

    sendSuccess(res, result, 'Message sent successfully', HttpStatus.CREATED, {
      chatMessage: result,
    });
  });

  getChatHistory = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this._getChatHistoryUseCase.execute(eventId, userId);
    sendSuccess(res, result, 'Chat history retrieved successfully', HttpStatus.OK, {
      messages: result,
    });
  });
}
