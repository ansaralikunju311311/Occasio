import { EventType } from '../../../common/enums/event-type';
import { EventStatus } from '../../../common/enums/eventstatus-enum';

export interface EventResponseDto {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  startTime: Date;
  endTime: Date;
  location?: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  maxOnlineUsers?: number;
  price: number;
  createdBy: string;
  status: EventStatus;
  picture: string;
  creatorDetails?: any;
  seatLayoutId?: string;
  SeatLayout?: any;
  seats?: any[];
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
