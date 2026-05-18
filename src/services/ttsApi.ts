import { callCloudFunction } from './cloud'

export interface TTSResult {
  news_id: string
  file_id: string
  duration: number
}

export function generateTTS(newsId: string): Promise<TTSResult> {
  return callCloudFunction<TTSResult>('generateTTS', { news_id: newsId })
}

export async function getTempFileUrl(fileId: string): Promise<string> {
  if (typeof wx !== 'undefined' && wx.cloud) {
    const res = await wx.cloud.getTempFileURL({ fileList: [fileId] })
    return res.fileList[0]?.tempFileURL || ''
  }
  return fileId
}
