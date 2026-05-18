import { View, Text, Button } from '@tarojs/components'
import './EmptyState.scss'

interface Props {
  message?: string
  showRetry?: boolean
  onRetry?: () => void
}

export default function EmptyState({ message = '暂无新闻', showRetry = false, onRetry }: Props) {
  return (
    <View className='empty-state'>
      <Text className='empty-state__icon'>📭</Text>
      <Text className='empty-state__message'>{message}</Text>
      {showRetry && onRetry && (
        <Button className='empty-state__btn' onClick={onRetry}>重试</Button>
      )}
    </View>
  )
}
