// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    postlist: await db.collection('post_collection').field({
      _id: true,
      address: true,
      author_avatar_url:true,//upload!!
      author_name: true,
      content: true,
      title: true,
      watch_count: true,
      update_time: true,
    }).orderBy('update_time', 'desc').get(),

  }
}