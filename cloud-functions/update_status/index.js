// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f"
})
// 云函数入口函数
const _ = db.command
exports.main = async (event, context) => {
  //const countResult = await db.collection('post_collection').get()
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
    if (status=1) {
      await db.collection('post_collection').where({
        _id: event.postid
      }).update({
        data: {
          deliverer_id: event.deliverer_id,
          status: _.inc(1)
        },
      success: function (res) {
        console.log(res)
      
      },
      fail: function (res) {
        console.log(res)

      }
    })} else {
      await db.collection('post_collection').where({
        _id: event.postid
      }).update({
        data: {
          status: _.inc(1)
        },
        success: function (res) {
          console.log(res)

        },
        fail: function (res) {
          console.log(res)

        }
      })
    }
}