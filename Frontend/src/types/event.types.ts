export interface SeatBlockCategory {
  name?: string;
  price?: number;
}

export interface SeatRow {
  rowNumber: number;
  columns: number;
  seats?: Array<{
    seatNumber: string;
    status: string;
  }>;
}

export interface SeatBlock {
  blockName: string;
  blocName?: string;
  rows?: SeatRow[];
  category?: SeatBlockCategory;
}

export interface SeatLayoutDetails {
  id?: string;
  _id?: string;
  blocks?: SeatBlock[];
}

export interface EventLocation {
  type: 'Point';
  coordinates: [number, number];
  address: string;
}

export interface EventItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  startTime: string | Date;
  endTime: string | Date;
  location?: EventLocation | null;
  maxOnlineUsers?: number;
  price?: number;
  createdBy: string | { _id?: string; name?: string; email?: string };
  creatorDetails?: {
    id?: string;
    name?: string;
    email?: string;
  };
  status: 'DRAFT' | 'ACTIVE' | 'LIVE' | 'COMPLETED' | 'CANCELED';
  picture: string;
  seatLayoutId?: string | SeatLayoutDetails;
  seatLayoutDetails?: SeatLayoutDetails;
  SeatLayout?: SeatLayoutDetails;
  layout?: SeatLayoutDetails;
  seats?: Array<Record<string, unknown>>;
  isPublished?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | Date;
  publishedAt?: string | Date;
  bookedTickets?: number;
  hasBookings?: boolean;
  minSeatPrice?: number | null;
}

export interface EventFilterParams {
  search?: string;
  eventType?: string;
  page?: number;
  limit?: number;
  upcoming?: boolean;
}

export interface EventMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedEventsResponse {
  events: EventItem[];
  metadata?: EventMetadata;
}
