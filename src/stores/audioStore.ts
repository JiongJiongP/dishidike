import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { generateTTS, getTempFileUrl } from '@/services/ttsApi'
import type { AudioState } from '@/types/audio'

interface AudioStore extends AudioState {
  play: (newsId: string, ttsStatus: string, ttsFileId?: string) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  onTimeUpdate: (callback: (currentTime: number, duration: number) => void) => void
}

let audioContext: Taro.InnerAudioContext | null = null
let timeUpdateCallback: ((currentTime: number, duration: number) => void) | null = null

export const useAudioStore = create<AudioStore>((set, get) => ({
  status: 'idle',
  currentNewsId: null,
  duration: 0,
  currentTime: 0,

  play: async (newsId: string, ttsStatus: string, ttsFileId?: string) => {
    set({ status: 'loading', currentNewsId: newsId })

    try {
      let fileId = ttsFileId

      if (ttsStatus !== 'completed' || !fileId) {
        const result = await generateTTS(newsId)
        fileId = result.file_id
      }

      const tempUrl = await getTempFileUrl(fileId!)

      if (audioContext) {
        audioContext.destroy()
      }

      audioContext = Taro.createInnerAudioContext()
      audioContext.src = tempUrl
      audioContext.autoplay = true

      audioContext.onCanplay(() => {
        set({ duration: audioContext?.duration || 0 })
      })

      audioContext.onPlay(() => {
        set({ status: 'playing' })
      })

      audioContext.onPause(() => {
        set({ status: 'paused' })
      })

      audioContext.onStop(() => {
        set({ status: 'idle', currentNewsId: null, currentTime: 0, duration: 0 })
      })

      audioContext.onEnded(() => {
        set({ status: 'idle', currentNewsId: null, currentTime: 0 })
      })

      audioContext.onTimeUpdate(() => {
        const ct = audioContext?.currentTime || 0
        const dur = audioContext?.duration || 0
        set({ currentTime: ct, duration: dur })
        timeUpdateCallback?.(ct, dur)
      })

      audioContext.onError((err) => {
        console.error('Audio playback error:', err)
        set({ status: 'error' })
      })
    } catch (err) {
      console.error('TTS generation failed:', err)
      set({ status: 'error' })
    }
  },

  pause: () => {
    audioContext?.pause()
  },

  resume: () => {
    audioContext?.play()
  },

  stop: () => {
    audioContext?.destroy()
    audioContext = null
    set({ status: 'idle', currentNewsId: null, currentTime: 0, duration: 0 })
  },

  seek: (time: number) => {
    if (audioContext) {
      audioContext.seek(time)
    }
  },

  onTimeUpdate: (callback) => {
    timeUpdateCallback = callback
  }
}))
