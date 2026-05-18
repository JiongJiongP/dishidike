import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { getNewsHistory, type BatchListItem } from '@/services/newsApi'
import { getBatchLabel } from '@/utils/time'
import { getPeriodLabel } from '@/utils/time'
import EmptyState from '@/components/EmptyState'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'
import './index.scss'

export default function HistoryPage() {
  const [batches, setBatches] = useState<BatchListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    setLoading(true)
    setError(null)
    try {
      const result = await getNewsHistory(1, 30)
      setBatches(result.items)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <View className='history-page'>
        <EmptyState message={error} showRetry onRetry={loadHistory} />
      </View>
    )
  }

  return (
    <ErrorBoundary>
      <View className='history-page'>
        <View className='history-page__header'>
          <Text className='history-page__title'>历史速览</Text>
        </View>

        {loading ? (
          <LoadingSkeleton />
        ) : batches.length === 0 ? (
          <EmptyState message='暂无历史记录' />
        ) : (
          <View className='history-page__list'>
            {batches.map(batch => (
              <View
                key={batch.batch_id}
                className='history-card'
                hoverClass='history-card--hover'
              >
                <View className='history-card__info'>
                  <Text className='history-card__date'>{getBatchLabel(batch.batch_id)}</Text>
                  <Text className='history-card__period'>{getPeriodLabel(batch.period)}</Text>
                </View>
                <Text className='history-card__count'>{batch.news_count}条</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ErrorBoundary>
  )
}
