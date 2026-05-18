import { create } from 'zustand'
import { getStorage, setStorage } from '@/utils/storage'

interface UserState {
  openId: string | null
  categories: string[]
  ttsSpeed: number

  setOpenId: (openId: string) => void
  setCategories: (cats: string[]) => void
  setTtsSpeed: (speed: number) => void
  loadPrefs: () => void
}

export const useUserStore = create<UserState>((set) => ({
  openId: null,
  categories: [],
  ttsSpeed: 1.0,

  setOpenId: (openId) => set({ openId }),

  setCategories: (categories) => {
    set({ categories })
    setStorage('pref_categories', categories)
  },

  setTtsSpeed: (speed) => {
    set({ ttsSpeed: speed })
    setStorage('pref_tts_speed', speed)
  },

  loadPrefs: () => {
    const categories = getStorage<string[]>('pref_categories', [])
    const ttsSpeed = getStorage<number>('pref_tts_speed', 1.0)
    set({ categories, ttsSpeed })
  }
}))
