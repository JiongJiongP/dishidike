import { View, Text, Button } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh, useShareAppMessage } from '@tarojs/taro'
import { useNewsStore } from '@/stores/newsStore'
import { useAudioStore } from '@/stores/audioStore'
import { useUserStore } from '@/stores/userStore'
import NewsCard from '@/components/NewsCard'
import AudioPlayer from '@/components/AudioPlayer'
import BatchSelector from '@/components/BatchSelector'
import CategoryFilter from '@/components/CategoryFilter'
import EmptyState from '@/components/EmptyState'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'
import type { NewsItem } from '@/types/news'
import './index.scss'

export default function IndexPage() {
  const { newsList, currentBatchId, currentPage, totalItems, activeCategory, isLoading, isRefreshing, error,
    loadInitialNews, loadMore, setCategory, refresh } = useNewsStore()
  const { status: playStatus, currentNewsId, play } = useAudioStore()
  const { loadPrefs } = useUserStore()

  useDidShow(() => {
    loadPrefs()
    if (newsList.length === 0) {
      loadInitialNews()
    }
  })

  usePullDownRefresh(() => {
    refresh().finally(() => {
      Taro.stopPullDownRefresh()
    })
  })

  useShareAppMessage(() => {
    return {
      title: '每日一刷 - 碎片时间听热点新闻',
      path: `/pages/index/index?batch_id=${currentBatchId || ''}`
    }
  })

  const handlePlay = (item: NewsItem) => {
    play(item._id, item.tts_status, item.tts_file_id)
  }

  if (error) {
    return (
      <View className='index-page'>
        <EmptyState message={error} showRetry onRetry={refresh} />
      </View>
    )
  }

  return (
    <ErrorBoundary>
      <View className='index-page'>
        <View className='index-page__header'>
          <Text className='index-page__title'>每日一刷</Text>
          <Text className='index-page__subtitle'>碎片时间，听见世界</Text>
        </View>

        <CategoryFilter active={activeCategory} onChange={setCategory} />
        <BatchSelector batchId={currentBatchId} page={currentPage} />

        {isLoading && newsList.length === 0 ? (
          <LoadingSkeleton />
        ) : newsList.length === 0 ? (
          <EmptyState message='暂无新闻，下拉刷新试试' />
        ) : (
          <View className='index-page__list'>
            {newsList.map(item => (
              <NewsCard
                key={item._id}
                item={item}
                playingId={currentNewsId}
                playStatus={playStatus}
                onPlay={handlePlay}
              />
            ))}
          </View>
        )}

        {newsList.length > 0 && (
          <View className='index-page__actions'>
            <View className='index-page__refresh-btn' onClick={loadMore}>
              {isLoading ? '加载中...' : '换一批'}
            </View>
            <Button className='index-page__share-btn' openType='share'>
              分享给朋友
            </Button>
          </View>
        )}

        <AudioPlayer />
      </View>
    </ErrorBoundary>
  )
}
