import { View, Text } from '@tarojs/components'
import { getBatchLabel } from '@/utils/time'
import './BatchSelector.scss'

interface Props {
  batchId: string | null
  page: number
}

export default function BatchSelector({ batchId, page }: Props) {
  if (!batchId) return null

  const label = getBatchLabel(batchId)

  return (
    <View className='batch-selector'>
      <Text className='batch-selector__text'>{label} · 第{page}页</Text>
    </View>
  )
}
