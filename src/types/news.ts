export interface NewsItem {
  _id: string
  title: string
  summary: string
  source: string
  category: NewsCategory
  url?: string
  thumbnail?: string
  batch_id: string
  tts_status: 'pending' | 'completed' | 'failed'
  tts_file_id?: string
  tts_duration?: number
  fetched_at: string
}

export type NewsCategory = '国内' | '国际' | '科技' | '财经' | '体育' | '娱乐'

export interface BatchInfo {
  _id: string
  batch_id: string
  period: 'morning' | 'noon' | 'evening'
  fetch_time: string
  news_count: number
  tts_count: number
}

export const CATEGORIES: NewsCategory[] = ['国内', '国际', '科技', '财经', '体育', '娱乐']

export const PERIOD_LABELS: Record<string, string> = {
  morning: '早间速览',
  noon: '午间速览',
  evening: '晚间速览'
}
