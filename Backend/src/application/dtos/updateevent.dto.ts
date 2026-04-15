// export interface UpdateEventDTO {
//   title?: string;
//   description?: string;
//   bannerUrl?: string;
//   eventType?: string;

//   startTime?: Date;
//   endTime?: Date;

//   price?: number;
//   maxOnlineUsers?: number;

//   location?: {
//     type: 'Point';
//     coordinates: [number, number];
//     address: string;
//   } | null;

//   layout?: any; // later restrict
// }

import { EventType } from '@/common/enums/event-type';

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  picture?: string;
  eventType?: EventType;

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
        rowNumber: string;
        columns: number;
      }[];
    }[];
  };
}