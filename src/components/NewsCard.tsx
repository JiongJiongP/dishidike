import { View, Text, Image } from '@tarojs/components'
import type { NewsItem } from '@/types/news'
import './NewsCard.scss'

interface Props {
  item: NewsItem
  playingId: string | null
  playStatus: string
  onPlay: (item: NewsItem) => void
}

export default function NewsCard({ item, playingId, playStatus, onPlay }: Props) {
  const isActive = playingId === item._id

  return (
    <View className='news-card' hoverClass='news-card--hover'>
      {item.thumbnail && (
        <Image className='news-card__thumb' src={item.thumbnail} mode='aspectFill' />
      )}
      <View className='news-card__body'>
        <Text className='news-card__title'>{item.title}</Text>
        <Text className='news-card__summary'>{item.summary}</Text>
        <View className='news-card__meta'>
          <Text className='news-card__source'>{item.source}</Text>
          <Text className='news-card__category'>{item.category}</Text>
        </View>
      </View>
      <View
        className={`news-card__play ${isActive ? 'news-card__play--active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onPlay(item) }}
      >
        <Text className='news-card__play-icon'>
          {isActive && playStatus === 'playing' ? '⏸' :
           isActive && playStatus === 'loading' ? '⏳' :
           '▶'}
        </Text>
      </View>
    </View>
  )
}
