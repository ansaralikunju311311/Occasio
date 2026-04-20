export interface SeatLayoutResponseDto {
  id: string;
  blocks: {
    blockName: string;
    rows: { rowNumber: number; columns: number }[];
    category: {
      name: string;
      price: number;
    };
  }[];
}
