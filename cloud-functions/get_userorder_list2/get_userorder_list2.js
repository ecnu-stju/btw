// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})

// 云函数入口函数
//s_number用来判定应该显示哪一状态的订单（是否可行）
exports.main = async (event, context, s_number) => {
  return {
    userorder: await db.collection('post_collection').field({
      _id: true,
      address: true,
      author_name: true,
      deliverer_name: true,  
      content: true,
      title: true,
      update_time: true
    }).where(_.or([
      {
        author_id: event.userInfo.openId  //author_id与当前授权用户id匹配
        status: event.status //匹配订单的状态。数据库目前没有status状态数据。
      },
      {
        deliverer_id: event.userInfo.openId//抢单用户id与当前用户id匹配
        status: event.status
      }
    ])).orderBy('update_time').get(),
  }
}