import { EventType } from '../../../common/enums/event-type';
import { EventStatus } from '../../../common/enums/eventstatus-enum';
import { UserResponseDto } from './user-response.dto';
import { SeatResponseDto } from './seat-response.dto';
import { SeatLayoutResponseDto } from './seat-layout-response.dto';

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
  seatLayoutId?: string;
  SeatLayout?: SeatLayoutResponseDto;
  seats?: SeatResponseDto[];
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
