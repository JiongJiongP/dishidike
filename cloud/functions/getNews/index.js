const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  try {
    const page = event.page || 1
    const pageSize = event.pageSize || 15
    const category = event.category || ''
    let batchId = event.batch_id || ''

    if (!batchId) {
      const batchRes = await db.collection('batches')
        .orderBy('fetch_time', 'desc')
        .limit(1)
        .get()

      if (batchRes.data.length > 0) {
        batchId = batchRes.data[0].batch_id
      } else {
        return {
          code: 0,
          message: 'success',
          data: { items: [], total: 0, batch_id: null, page: 1, pageSize }
        }
      }
    }

    const where = { batch_id: batchId }
    if (category) {
      where.category = category
    }

    const skip = (page - 1) * pageSize

    const [countRes, listRes] = await Promise.all([
      db.collection('news').where(where).count(),
      db.collection('news')
        .where(where)
        .orderBy('fetched_at', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
    ])

    return {
      code: 0,
      message: 'success',
      data: {
        items: listRes.data,
        total: countRes.total,
        batch_id: batchId,
        page,
        pageSize
      }
    }
  } catch (err) {
    console.error('getNews error:', err)
    return { code: -1, message: err.message || '查询新闻失败', data: null }
  }
}
