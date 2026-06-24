export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  applyingupgrade?: string;
  eventType?: string;
  upcoming?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
