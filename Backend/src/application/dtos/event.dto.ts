import { EventStatus } from '../../common/enums/eventstatus-enum';
import { EventType } from '../../common/enums/event-type';

export interface EventDto {
  title: string;
  description: string;
  bannerUrl: string;
  eventType: EventType;

  startTime: string | Date;
  endTime: string | Date;

  status?: EventStatus;
  price: number;

  isSeatLayoutEnabled: boolean;

  maxOnlineUsers?: number;

  location?: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  } | null;

  latitude?: number;
  longitude?: number;
  address?: string;

  layout?: {
    blocks: {
      blockName: string;

      category: {
        name: string;
        price: number;
      };

      rows: {
        rowNumber: number;
        columns: number;
      }[];
    }[];
  };
}
