const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

const JUHE_KEY = process.env.JUHE_KEY || ''
const JUHE_URL = 'https://v.juhe.cn/toutiao/index'

function buildBatchId(period) {
  const now = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const hour = period === 'morning' ? '07' : period === 'noon' ? '12' : '18'
  return `${date}-${hour}`
}

function getPeriod() {
  const hour = new Date().getHours()
  if (hour <= 9) return 'morning'
  if (hour <= 15) return 'noon'
  return 'evening'
}

async function fetchFromJuHe() {
  const res = await axios.get(JUHE_URL, {
    params: { key: JUHE_KEY, type: '' },
    timeout: 15000
  })
  if (res.data.error_code !== 0) {
    throw new Error(`聚合数据API错误: ${res.data.reason}`)
  }
  return res.data.result.data || []
}

function normalizeNews(raw, batchId) {
  return raw.map(item => ({
    title: item.title || '',
    summary: (item.title || '').length > 80 ? item.title.slice(0, 80) : (item.title || ''),
    source: item.source || item.author_name || '未知来源',
    category: mapCategory(item.category || ''),
    url: item.url || '',
    thumbnail: item.thumbnail_pic_s || '',
    batch_id: batchId,
    tts_status: 'pending',
    tts_file_id: '',
    tts_duration: 0,
    fetched_at: new Date()
  }))
}

function mapCategory(cat) {
  const map = {
    '头条': '国内', '新闻': '国内', '国内': '国内',
    '国际': '国际', '世界': '国际',
    '科技': '科技', '互联网': '科技', '科学': '科技',
    '财经': '财经', '经济': '财经', '股票': '财经',
    '体育': '体育', '运动': '体育', '足球': '体育', '篮球': '体育',
    '娱乐': '娱乐', '电影': '娱乐', '音乐': '娱乐', '明星': '娱乐'
  }
  return map[cat] || '国内'
}

exports.main = async (event, context) => {
  try {
    const period = event.period || getPeriod()
    const batchId = event.batch_id || buildBatchId(period)

    const existingBatch = await db.collection('batches')
      .where({ batch_id: batchId })
      .count()

    if (existingBatch.total > 0) {
      return { code: 0, message: '批次已存在', data: { batch_id: batchId, count: 0, skipped: true } }
    }

    const rawNews = await fetchFromJuHe()
    const newsItems = normalizeNews(rawNews, batchId)

    if (newsItems.length === 0) {
      return { code: 0, message: '无新闻数据', data: { batch_id: batchId, count: 0 } }
    }

    // 逐条添加（云开发无批量add API）
    const addPromises = newsItems.map(item => db.collection('news').add({ data: item }))
    const addResults = await Promise.all(addPromises)
    const ids = addResults.map(r => r._id)

    await db.collection('batches').add({
      data: {
        batch_id: batchId,
        period,
        fetch_time: new Date(),
        news_count: newsItems.length,
        tts_count: 0
      }
    })

    return {
      code: 0,
      message: 'success',
      data: {
        batch_id: batchId,
        count: newsItems.length,
        ids
      }
    }
  } catch (err) {
    console.error('fetchNews error:', err)
    return { code: -1, message: err.message || '抓取新闻失败', data: null }
  }
}
