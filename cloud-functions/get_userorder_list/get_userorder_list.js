// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    userorder: await db.collection('userorder_collection').field({
      _id: true,
      address: true,
      author_name: true,
      content: true,
      title: true,
      update_time: true
    }).orderBy('update_time', 'desc').get(),

  }
}