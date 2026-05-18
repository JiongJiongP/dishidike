import Taro from '@tarojs/taro'
import type { CloudResponse } from '@/types/cloud'

export async function callCloudFunction<T>(name: string, data?: Record<string, unknown>): Promise<T> {
  const res = await Taro.cloud.callFunction({
    name,
    data
  }) as { result: CloudResponse<T> }

  if (res.result.code !== 0) {
    throw new Error(res.result.message || '调用云函数失败')
  }

  return res.result.data
}
