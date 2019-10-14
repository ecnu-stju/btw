// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f"
})

exports.main = async (event, context) => {
  try {
    return await db.collection('post_collection').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // author_id: event.userInfo.openId,//特例
        // author_avatar_url: event.author_avatar_url,
        parcel_destination: event.parcel_destination,//包裹目的地
        parcel_handover_time: event.parcel_handover_time,//快递交接时间
        parcel_size:event.parcel_size
      }
    })
  } catch (e) {
    console.error(e)
  }
}