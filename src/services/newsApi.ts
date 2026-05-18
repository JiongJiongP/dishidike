import { callCloudFunction } from './cloud'
import type { NewsItem } from '@/types/news'
import type { CloudResponse } from '@/types/cloud'

export interface GetNewsParams {
  category?: string
  batch_id?: string
  page?: number
  pageSize?: number
}

export interface GetNewsResult {
  items: NewsItem[]
  total: number
  batch_id: string | null
  page: number
  pageSize: number
}

export interface BatchListItem {
  batch_id: string
  period: string
  fetch_time: string
  news_count: number
}

export function getNews(params: GetNewsParams = {}): Promise<GetNewsResult> {
  return callCloudFunction<GetNewsResult>('getNews', {
    category: params.category || '',
    batch_id: params.batch_id || '',
    page: params.page || 1,
    pageSize: params.pageSize || 15
  })
}

export function getNewsHistory(page = 1, pageSize = 20): Promise<{
  items: BatchListItem[]
  total: number
}> {
  return callCloudFunction('getNewsHistory', { page, pageSize })
}
