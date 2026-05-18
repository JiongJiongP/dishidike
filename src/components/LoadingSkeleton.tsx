import { View } from '@tarojs/components'
import './LoadingSkeleton.scss'

export default function LoadingSkeleton() {
  return (
    <View className='skeleton-list'>
      {[1, 2, 3].map(i => (
        <View key={i} className='skeleton-card'>
          <View className='skeleton-line skeleton-line--title' />
          <View className='skeleton-line skeleton-line--text' />
          <View className='skeleton-line skeleton-line--text skeleton-line--short' />
        </View>
      ))}
    </View>
  )
}
