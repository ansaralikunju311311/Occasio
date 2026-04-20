import { SeatStatus } from '../../../common/enums/searstatus-enum';

export interface SeatResponseDto {
  id: string;
  block: string;
  row: number;
  column: number;
  seatNumber: string;
  categoryName: string;
  price: number;
  status: SeatStatus;
  holdExpiresAt?: Date;
}
