// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})
// 云函数入口函数
exports.main = async (event, context) => {

  return {
    orderdetail: await db.collection('userorder_collection').where({
      _id: event.postid
    }).get(),
  }
}