const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  try {
    const page = event.page || 1
    const pageSize = event.pageSize || 20
    const skip = (page - 1) * pageSize

    const [countRes, listRes] = await Promise.all([
      db.collection('batches').count(),
      db.collection('batches')
        .orderBy('fetch_time', 'desc')
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
        page,
        pageSize
      }
    }
  } catch (err) {
    console.error('getNewsHistory error:', err)
    return { code: -1, message: err.message || '查询历史失败', data: null }
  }
}
