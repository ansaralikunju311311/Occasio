import type { EventType } from '../../common/enums/event-type';
import type { EventStatus } from '../../common/enums/eventstatus-enum';

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  picture?: string;
  eventType?: EventType;
  status?: EventStatus;

  startTime?: Date;
  endTime?: Date;

  price?: number;
  maxOnlineUsers?: number;

  location?: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  } | null;

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
