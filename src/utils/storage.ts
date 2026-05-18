import Taro from '@tarojs/taro'

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = Taro.getStorageSync(key)
    return value !== undefined ? value : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorage(key: string, value: unknown): void {
  try {
    Taro.setStorageSync(key, value)
  } catch {
    // silently fail
  }
}
