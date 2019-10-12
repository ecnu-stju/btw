// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f"
})
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  await db.collection('post_collection').where({
    _id: event.postid}).update({
      data: {
        status: event.status+1,//简略版

      },
      success: function (res) {
        console.log(res.data)
      
      }
    })
}