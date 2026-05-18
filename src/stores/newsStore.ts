import Taro from '@tarojs/taro'
import { create } from 'zustand'
import type { NewsItem, NewsCategory } from '@/types/news'
import { getNews } from '@/services/newsApi'
import { PAGE_SIZE } from '@/utils/constants'

interface NewsState {
  newsList: NewsItem[]
  currentBatchId: string | null
  currentPage: number
  totalItems: number
  activeCategory: string
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  loadInitialNews: () => Promise<void>
  loadMore: () => Promise<void>
  setCategory: (category: string) => Promise<void>
  refresh: () => Promise<void>
}

export const useNewsStore = create<NewsState>((set, get) => ({
  newsList: [],
  currentBatchId: null,
  currentPage: 1,
  totalItems: 0,
  activeCategory: '',
  isLoading: false,
  isRefreshing: false,
  error: null,

  loadInitialNews: async () => {
    set({ isLoading: true, error: null })
    try {
      const result = await getNews({
        category: get().activeCategory || undefined,
        page: 1,
        pageSize: PAGE_SIZE
      })
      set({
        newsList: result.items,
        currentBatchId: result.batch_id,
        currentPage: 1,
        totalItems: result.total,
        isLoading: false
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '加载新闻失败'
      set({ error: message, isLoading: false })
    }
  },

  loadMore: async () => {
    const state = get()
    if (state.isLoading || state.isRefreshing) return

    const totalPages = Math.ceil(state.totalItems / PAGE_SIZE)
    const nextPage = state.currentPage + 1

    if (nextPage > totalPages) {
      Taro.showToast({ title: '没有更多了', icon: 'none', duration: 2000 })
      return
    }

    set({ isLoading: true, error: null })
    try {
      const result = await getNews({
        batch_id: state.currentBatchId || undefined,
        category: state.activeCategory || undefined,
        page: nextPage,
        pageSize: PAGE_SIZE
      })
      set({
        newsList: result.items,
        currentPage: nextPage,
        totalItems: result.total,
        isLoading: false
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '加载失败'
      set({ error: message, isLoading: false })
    }
  },

  setCategory: async (category: string) => {
    set({ activeCategory: category })
    await get().loadInitialNews()
  },

  refresh: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const result = await getNews({
        category: get().activeCategory || undefined,
        page: 1,
        pageSize: PAGE_SIZE
      })
      set({
        newsList: result.items,
        currentBatchId: result.batch_id,
        currentPage: 1,
        totalItems: result.total,
        isRefreshing: false
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '刷新失败'
      set({ error: message, isRefreshing: false })
    }
  }
}))
