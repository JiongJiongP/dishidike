export interface AudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error'
  currentNewsId: string | null
  duration: number
  currentTime: number
}
