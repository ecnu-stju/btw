// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    userorder_list: await db.collection('post_collection').field({
      _id: true,
      address: true,
      author_avatar_url: true,//upload!!
      author_name: true,
      author_parcel_name: true,
      content: true,
      title: true,
      update_time: true
    }).where(_.or([
      {
        author_id: event.author_id  //author_id与当前授权用户id匹配
      },
      {
        deliverer_id: event.user_openid
      }
    ])).orderBy('update_time', 'desc').get(),
  }
}