import { View, Text } from '@tarojs/components'
import { useAudioStore } from '@/stores/audioStore'
import './AudioPlayer.scss'

export default function AudioPlayer() {
  const { status, currentNewsId, duration, currentTime, pause, resume, stop, seek } = useAudioStore()

  if (status === 'idle') return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <View className='audio-player'>
      <View className='audio-player__progress' style={{ width: `${progress}%` }} />
      <View className='audio-player__content'>
        <View className='audio-player__controls'>
          {status === 'playing' ? (
            <Text className='audio-player__btn' onClick={pause}>⏸</Text>
          ) : (
            <Text className='audio-player__btn' onClick={resume}>▶</Text>
          )}
        </View>
        <View className='audio-player__info'>
          <Text className='audio-player__label'>
            {status === 'loading' ? '生成语音中...' : '正在播放'}
          </Text>
          <Text className='audio-player__time'>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
        <Text className='audio-player__btn audio-player__close' onClick={stop}>✕</Text>
      </View>
    </View>
  )
}
