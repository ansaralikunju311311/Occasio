export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
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
