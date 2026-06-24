import type { EventType } from '../../../common/enums/event-type';
import type { EventStatus } from '../../../common/enums/eventstatus-enum';

import type { UserResponseDto } from './user-response.dto';
import type { SeatResponseDto } from './seat-response.dto';
import type { SeatLayoutResponseDto } from './seat-layout-response.dto';

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
  creatorDetails?: UserResponseDto;
  bookedTickets?: number;
  seatLayoutId?: string;
  SeatLayout?: SeatLayoutResponseDto;
  seats?: SeatResponseDto[];
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
