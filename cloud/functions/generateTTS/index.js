const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  try {
    const { news_id } = event
    if (!news_id) {
      return { code: -1, message: '缺少 news_id 参数', data: null }
    }

    const newsRes = await db.collection('news').doc(news_id).get()
    const news = newsRes.data

    if (!news) {
      return { code: -1, message: '新闻不存在', data: null }
    }

    if (news.tts_status === 'completed' && news.tts_file_id) {
      return {
        code: 0,
        message: 'TTS已生成',
        data: {
          news_id,
          file_id: news.tts_file_id,
          duration: news.tts_duration || 0
        }
      }
    }

    const text = `${news.title}。${news.summary}`.slice(0, 500)

    const ttsResult = await cloud.openapi.tts.textToVoice({
      text,
      lang: 'zh_CN',
      speed: 1.0,
      voiceType: 'female_neutral'
    })

    const audioBuffer = Buffer.from(ttsResult.Audio, 'base64')
    const cloudPath = `tts/${news_id}.mp3`

    const uploadRes = await cloud.uploadFile({
      cloudPath,
      fileContent: audioBuffer
    })

    const duration = ttsResult.Duration || 0

    await db.collection('news').doc(news_id).update({
      data: {
        tts_status: 'completed',
        tts_file_id: uploadRes.fileID,
        tts_duration: duration
      }
    })

    return {
      code: 0,
      message: 'success',
      data: {
        news_id,
        file_id: uploadRes.fileID,
        duration
      }
    }
  } catch (err) {
    console.error('generateTTS error:', err.message)

    if (news_id) {
      try {
        await db.collection('news').doc(news_id).update({
          data: { tts_status: 'failed' }
        })
      } catch (e) {
        // ignore
      }
    }

    return { code: -1, message: err.message || 'TTS生成失败', data: null }
  }
}
