export interface CloudResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  batch_id: string | null
  page: number
  pageSize: number
}
